module.exports = {
  appenders: { 
    app: { 
      type: 'stdout', 
    } 
  },
  categories: { 
    default: { 
      appenders: ['app'], 
      level: 'debug' 
    },
    master: {
      appenders: ['app'], 
      level: 'debug' 
    },
    worker: {
      appenders: ['app'], 
      level: 'debug' 
    },
    agent: {
      appenders: ['app'], 
      level: 'debug' 
    },
  }
};