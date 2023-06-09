import React from "react";
import { Text } from "react-native";

const MedalOption = ({ completedRoutes }) => {
  let medal, message;

  if (completedRoutes < 2) {
    medal = "";
    message = "Has de completar almenys 2 rutes aquesta setmana per aconseguir una medalla";
  } else if (completedRoutes < 4) {
    medal = "🥉";
    message = "Molt bé! Ja tens la medalla de bronze! Completa " + (4-completedRoutes)+ " rutes més aquesta setmana per aconseguir la de plata";
  } else if (completedRoutes < 6) {
    medal = "🥈";
    message = "Fantàstic! Ja tens la medalla de plata! Completa " + (6-completedRoutes)+ " rutes més aquesta setmana per aconseguir la d'or";
  } else {
    medal = "🥇";
    message = "Increïble! Ja tens la medalla d'or! Continua així i supera el teu rècord setmanal personal!";
  }

  return (
    <>
      <Text style={{ marginBottom: 10, fontSize: 15 }}>
        {medal} {message}
      </Text>
    </>
  );
};

export default MedalOption;
