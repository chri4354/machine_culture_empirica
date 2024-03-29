module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: "<SERVER_URL>",
      username: "ubuntu",
      pem: "~/.ssh/machine-culture-2.pem"
    }
  },

  app: {
    // TODO: change app name and path
    name: "empirica",
    path: "../",

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: "http://<SERVER_URL>",

      MONGO_URL: "<MONGO_URL>"
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: "zodern/meteor:root"
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  }

  // mongo: {
  //   version: "3.4.1",
  //   servers: {
  //     one: {}
  //   }
  // }

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
