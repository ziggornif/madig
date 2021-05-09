const debug = require('debug')('madig');
const Joi = require('joi');

// Injectable configuration schema
const schema = Joi.array().items(
  Joi.object({
    class: Joi.function().class().required(),
    dependsOn: Joi.array().items(
      Joi.alternatives().try(Joi.function().class(), Joi.object({ name: Joi.string() }).unknown(true))
    ),
  })
);

class Madig {
  /**
   * @typedef {Object} InjectableConfiguration
   * @property {Object} class - Class to instanciate
   * @property {Array<Object>} dependsOn - Class dependencies to inject
   *
   * Madig constructor
   * @param {Array<InjectableConfiguration>} diConfig
   */
  constructor(diConfig) {
    const { error } = schema.validate(diConfig);
    if (error) {
      debug('configuration error : ', error.toString());
      throw new Error('Invalid injectable configuration');
    }
    this.diConfig = diConfig;
    this.container = new Map();
  }

  /**
   * Create graph dependencies from configuration
   * @returns {object} graph
   */
  createGraph() {
    const graph = {};
    for (const item of this.diConfig) {
      graph[item.class.name] = item.dependsOn;
      for (const dep of item.dependsOn) {
        graph[dep.name] = graph[dep.name] || [];
      }
    }
    return graph;
  }

  /**
   * Retrieve class or module by name
   * @param {string} name
   * @returns {Object} class or module
   * @throws Will throw an error if the injectable is not found.
   */
  resolveInjectable(name) {
    let injectable = this.diConfig.find((c) => c.class.name === name)?.class;
    if (!injectable) {
      injectable = this.diConfig
        .map((c) => c.dependsOn)
        .flat()
        .find((d) => d.name === name);
    }

    if (!injectable) throw new Error(`Configuration error, injectable ${name} not found`);
    return injectable;
  }

  /**
   * Detect if the current object is a class
   * @param {object} item
   * @returns
   */
  isClass(item) {
    return !!item?.prototype?.constructor;
  }

  /**
   * Load configuration, instanciate classes and inject them
   * Also add them to the IOC container
   */
  load() {
    const dependencies = this.createGraph(this.diConfig);
    const keys = Object.keys(dependencies);
    const used = new Set();
    const result = [];
    let i;
    let item;
    let length;

    do {
      length = keys.length;
      i = 0;
      while (i < keys.length) {
        if (dependencies[keys[i]].every((curr) => used.has(curr.name))) {
          [item] = keys.splice(i, 1);
          result.push(item);
          used.add(item);
        } else {
          i += 1;
        }
      }
    } while (keys.length && keys.length !== length);

    debug('Start injection');

    for (const res of result) {
      const Injectable = this.resolveInjectable(res);
      if (this.isClass(Injectable)) {
        const config = this.diConfig.find((c) => c.class.name === res);
        const constructorParams = [];
        for (const dep of config?.dependsOn || []) {
          constructorParams.push(this.container.get(dep.name));
        }
        const Instance = new Injectable(...constructorParams);
        this.container.set(res, Instance);
      } else {
        this.container.set(res, Injectable[res]);
      }
    }
  }
}

module.exports = Madig;
