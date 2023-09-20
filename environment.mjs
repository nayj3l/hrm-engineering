// Determine the environment based on the hostname
function getEnvironment() {
  if (window.location.hostname === 'nayj3l.github.io') {
      return 'development';
  } else if (window.location.hostname.startsWith('192.168.')) {
      return 'local';
  } else {
      return 'production';
  }
}

const environment = getEnvironment();

export default environment;
