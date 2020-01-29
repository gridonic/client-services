import axios from 'axios';

export default class GridonicApiWebpackPlugin {
  private pkg: any;

  constructor(pkg: any) {
    this.pkg = pkg;
  }

  public async apply(compiler: any) {
    return this.run();
  }

  private async run() {
    try {
      const { name, version, gridonic } = this.pkg;
      const { generator } = gridonic;

      await axios.post('https://api.gridonic.ch/api/monitoring/build', {
        name,
        version,
        projectId: generator.projectId,
        kind: generator.kind,
        generatorVersion: generator.version,
      }, {
        headers: {
          Authorization: gridonic.apiToken,
        },
      });
    } catch (error) {
      // no-op: We never want this plugin to fail!
      console.log(`Generator info could not be sent to gridonic api: ${error}`);
    }

    console.log('Generator info sent to gridonic api');
  }
}
