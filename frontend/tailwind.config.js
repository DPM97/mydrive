module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        sidePanel: '200px calc(100% - 200px)',
      },
      gridTemplateRows: {
        sidePanel: 'minmax(250px, 1fr) calc(100% - 250px)'
      },
      minHeight: {
        sidePanel: 'calc(100vh - 85px)',
        sidePanelMobile: 'auto'
      }
    },
  },
  plugins: [],
}