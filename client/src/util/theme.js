export default {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#01a0b5",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  spreadThis: {
    typography: {
      useNextVariants: true
    },
    form: {
      textAlign: "center",
      "& input": {
        color: "#fff"
      },
      "& label": {
        color: "#9e9c9c"
      }
    },
    image: {
      maxWidth: "100px",
      margin: "20px auto"
    },
    pageTitle: {
      margin: "10px auto",
      fontFamily: "Ubuntu"
    },
    textField: {
      margin: "10px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    },
    route: {
      color: "#008394"
    },
    like: {
      color: "#b71c1c"
    },
    createdAt: {
      color: "#9e9c9c"
    },
    handle: {
      color: "#01a0b5",
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline"
      }
    }
  }
};
