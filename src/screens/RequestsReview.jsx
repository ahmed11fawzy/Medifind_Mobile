
// import React from 'react';
// import { Text, View, StyleSheet, ScrollView , FlatList} from 'react-native';
// import { Avatar, Button, Card } from 'react-native-paper';
// import {useGetAllRequestsQuery} from '../redux/Slice/request'

// const LeftContent = props => <Avatar.Icon {...props} icon="account" style={{ backgroundColor: '#66d5c1' }} />;


// export function RequestsReview() {
//   const { data, isLoading, isError } = useGetAllRequestsQuery();
//   if (isLoading) {
//     return <Text style={{ color: 'blue', fontSize: 30 ,textAlign: 'center'}}>Loading...</Text>;
//   }

//   if (isError) {
//     return <Text style={{ color: 'red',fontSize: 30 ,textAlign: 'center' }}>Error</Text>;
//   }
//   if (!data) {
//     return <Text style={{ color: 'yellow', fontSize: 30 ,textAlign: 'center' }}>No data available</Text>;
//   }
//   const MedicineRequestIcon = () => {
//     return <Avatar.Icon size={50} icon="pill" color="#0e4835aa" style={{ backgroundColor: "#49d3ac" }} />;
//   };
  

//   return (
//     <ScrollView contentContainerStyle={styles.container}>

//        <Text style={styles.title}>Requests</Text>
//        <View style={styles.iconContainer}>{MedicineRequestIcon()}</View>

    

//       <FlatList
//         data={data}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => 
        
//           <Card style={styles.card}>
//           <Card.Title title="Heba Elgohary" left={LeftContent} />
//           <Card.Content>
//             <Text style={styles.label}>Name: <Text style={styles.value}>{item.req_name}</Text></Text>
//             <Text style={styles.label}>Description: <Text style={styles.description}>
//             {item.req_description}
//             </Text></Text>
//           </Card.Content>
          
//           <Card.Cover source={{ uri: item.prescription_img }} style={styles.image} />
  
//           <Card.Actions style={styles.actions}>
//             <Button mode="contained" style={styles.acceptButton} labelStyle={styles.buttonLabel}>Accept</Button>
//             <Button mode="contained" style={styles.rejectButton} labelStyle={styles.buttonLabel}>Reject</Button>
//           </Card.Actions>
//         </Card>

        
//         }
//       />
  






     
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     backgroundColor: '#f5f5f5',
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//     fontFamily: 'serif',
//   },
//   iconContainer: {
//     marginBottom: 15,
//   },
//   card: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 15,
//     elevation: 5, // Adds a shadow effect
//     padding: 15,
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#444',
//     marginBottom: 5,
//   },
//   value: {
//     color: '#6b696a',
//     fontWeight: 'bold',
//   },
//   description: {
//     fontWeight: 'normal',
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 22, // Better readability
//   },
//   image: {
//     width: '100%',
//     height: '350',
//     objectFit: 'cover',
//     borderRadius: 10,
//     marginTop: 10,
//   },
//   actions: {
//     justifyContent: 'space-between',
//     marginTop: 15,
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50',
//     borderRadius: 10,
//     paddingVertical: 5,
//     flex: 1,
//     marginRight: 5,
//   },
//   rejectButton: {
//     backgroundColor: '#e64e67',
//     borderRadius: 10,
//     paddingVertical: 5,
//     flex: 1,
//     marginLeft: 5,
//   },
//   buttonLabel: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });





import React from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useGetAllRequestsQuery } from '../redux/Slice/request';

const LeftContent = (props) => (
  <Avatar.Icon {...props} icon="account" style={{ backgroundColor: '#66d5c1' }} />
);

export function RequestsReview() {
  const { data, isLoading, isError } = useGetAllRequestsQuery();

  const MedicineRequestIcon = () => (
    <Avatar.Icon size={50} icon="pill" color="#0e4835aa" style={{ backgroundColor: "#49d3ac" }} />
  );

  // Handle Loading and Error States
  if (isLoading) {
    return <ActivityIndicator size="large" color="#49d3ac" style={styles.loader} />;
  }

  if (isError || !data || data.length === 0) {
    return <Text style={styles.errorText}>No requests available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requests</Text>
      <View style={styles.iconContainer}>{MedicineRequestIcon()}</View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title="Heba Elgohary" left={LeftContent} />
            <Card.Content>
              <Text style={styles.label}>
                Name: <Text style={styles.value}>{item.req_name}</Text>
              </Text>
              <Text style={styles.label}>
                Description: <Text style={styles.description}>{item.req_description}</Text>
              </Text>
            </Card.Content>

            {item.prescription_img ? (
              <Card.Cover source={{ uri: item.prescription_img }} style={styles.image} />
            ) : null}

            <Card.Actions style={styles.actions}>
              <Button mode="contained" style={styles.acceptButton} labelStyle={styles.buttonLabel}>
                Accept
              </Button>
              <Button mode="contained" style={styles.rejectButton} labelStyle={styles.buttonLabel}>
                Reject
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    fontFamily: 'serif',
  },
  iconContainer: {
    marginBottom: 15,
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  value: {
    color: '#6b696a',
    fontWeight: 'bold',
  },
  description: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
    marginTop: 10,
  },
  actions: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#e64e67',
    borderRadius: 10,
    paddingVertical: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RequestsReview;
