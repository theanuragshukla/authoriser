import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    nord: {
      polarNight1: "#2E3440",
      polarNight2: "#3B4252",
      polarNight3: "#434C5E",
      polarNight4: "#4C566A",
      snow1: "#D8DEE9",
      snow2: "#E5E9F0",
      snow3: "#ECEFF4",
      frost1: "#8FBCBB",
      frost2: "#88C0D0",
      frost3: "#81A1C1",
      frost4: "#5E81AC",
      aurora1: "#BF616A",
      aurora2: "#D08770",
      aurora3: "#EBCB8B",
      aurora4: "#A3BE8C",
      aurora5: "#B48EAD",
    },
  },
  components: {
    Button: {
      baseStyle: {
        bg: "nord.frost3",
        color: "black",
      },
    },
    // Add more components and styles as needed
  },
});

export default theme;
