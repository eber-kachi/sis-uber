// ---
// patches:
// - path: "app/screens/index.ts"
//   append: "export * from \"./ClientHistoryOfTripScreen\"\n"
//   skip:
// - path: "app/navigators/AppNavigator.tsx"
//   replace: "// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST"
//   insert: "ClientHistoryOfTrip: undefined\n\t// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST"
// - path: "app/navigators/AppNavigator.tsx"
//   replace: "{/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}"
//   insert: "<Stack.Screen name=\"ClientHistoryOfTrip\" component={Screens.ClientHistoryOfTripScreen} />\n\t\t\t{/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}"
//   skip:
// ---
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, View, ViewStyle, Text as TextBase } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ClientHistoryOfTripScreenProps extends NativeStackScreenProps<AppStackScreenProps<"ClientHistoryOfTrip">> {}

export const ClientHistoryOfTripScreen: FC<ClientHistoryOfTripScreenProps> = observer(function ClientHistoryOfTripScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const historialViajes = [
    {
      id: 1,
      fecha: '25 de mayo de 2023',
      origen: 'Calle Principal 123',
      destino: 'Avenida Central 456',
      costo: 15.50,
    },
    // Agrega más elementos de historial de viajes según tu estructura de datos
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={$txtFecha} text={`${item.fecha}`} />
      <Text style={$txtDetalles} text={` Origen: ${item.origen} - Destino: ${item.destino}`} />
      <TextBase style={styles.detalles}>

      </TextBase>

      <Text text={`Costo: ${item.costo}`} />
      {/*<TextBase style={styles.costo}>Costo: ${item.costo}</TextBase>*/}
    </View>
  );

  return (
    <Screen style={$root} preset="scroll">

      <Text text="Historial de Viajes" />
      {/*<Text style={styles.title}>Historial de Viajes</Text>*/}
      <FlatList
        data={historialViajes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $title: TextStyle = {
  marginBottom: spacing.small,
}

const $txtFecha: TextStyle = {
  marginBottom: spacing.small,
  fontSize: spacing.small,
  fontWeight: 'bold',
}
const $txtDetalles: TextStyle = {
  marginBottom: spacing.micro,
  fontSize: spacing.small,
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
  },
  fecha: {
    // fontSize: 16,
    // fontWeight: 'bold',
    // marginBottom: 8,
  },
  detalles: {
    fontSize: 14,
    marginBottom: 4,
  },
  costo: {
    fontSize: 14,
    fontWeight: 'bold',
  },
};
