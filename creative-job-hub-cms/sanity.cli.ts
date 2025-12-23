import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '0rgnxal1',
    dataset: 'production'
  },
  deployment: {
    appId: 'rjrub93jyz90te7te43m027s',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
