import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useAddRequestMutation } from "../redux/Slice/request"; 
import { useAuth } from "../hooks/useAuth"; 
import { useDispatch } from "react-redux";
const { width } = Dimensions.get('window');

const MedicineDonationCard = ({medicine}) => {
    const navigation = useNavigation();
    const { userId } = useAuth(); 
    const dispatch = useDispatch();
    const [addRequest] = useAddRequestMutation();
    const handlePick = async () => {
        console.log(" Sending Data:", { 
            user_id: userId, 
            medicine: medicine?._id,
            status: true 
        });
    
        try {
            const response = await addRequest({
                user_id: userId,  
                medicine: medicine?._id, 
            }).unwrap(); 
    
            console.log("Request Added Successfully:", response);
            navigation.navigate("Needs");
        } catch (error) {
            console.error("Error Adding Request:", error);
        }
    };

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Calculate days until expiry
  const daysUntilExpiry = Math.ceil((new Date(medicine.expire_date) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilExpiry < 30;

  // Animation effects
  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(translateYAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolated values
  const translateY = translateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const wave = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 10, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.cardWrapper,
        { 
          transform: [{ translateY }],
          opacity: opacityAnim,
        }
      ]}
    >
      {/* Animated Background Pattern */}
      <Animated.View style={[styles.backgroundPattern, { transform: [{ rotate }] }]}>
        <LinearGradient
          colors={['rgba(0, 178, 188, 0.1)', 'rgba(0, 178, 188, 0.05)']}
          style={styles.patternGradient}
        />
        <View style={styles.patternGrid}>
          {[...Array(9)].map((_, i) => (
            <View key={i} style={styles.patternCell}>
              <View style={styles.patternDot} />
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Floating Elements */}
      <Animated.View style={[styles.floatingElement1, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.floatingElement2, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.floatingElement3, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.floatingElement4, { transform: [{ rotate }] }]} />

      {/* Main Card Container */}
      <View style={styles.cardContainer}>
        {/* Top Section with Image */}
        <View style={styles.topSection}>
          <Animated.View 
            style={[
              styles.imageContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Image 
              source={{ uri: medicine.image_path }}
              style={styles.medicineImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
              style={styles.imageOverlay}
            />
            <View style={styles.expiryBadge}>
              <MaterialCommunityIcons 
                name={isUrgent ? "clock-alert" : "clock-outline"} 
                size={16} 
                color="#fff" 
              />
              <Text style={styles.expiryText}>{daysUntilExpiry}d</Text>
            </View>
          </Animated.View>

          {/* Status Indicator */}
          <View style={[styles.statusIndicator, isUrgent && styles.urgentStatus]}>
            <Animated.View 
              style={[
                styles.statusDot,
                { transform: [{ scale: pulseAnim }] }
              ]} 
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.concentration}>{medicine.concentration}</Text>
            </View>
            <Animated.View 
              style={[
                styles.quantityBadge,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <MaterialCommunityIcons name="pill" size={16} color="#fff" />
              <Text style={styles.quantityText}>{medicine.quantity}</Text>
            </Animated.View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Animated.View 
                style={[
                  styles.infoIcon,
                  { }
                ]}
              >
                <MaterialCommunityIcons name="account" size={20} color="#00b2bc" />
              </Animated.View>
              <Text style={styles.infoText}>{medicine.user_id.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, isUrgent && styles.urgentIcon]}>
                <MaterialCommunityIcons 
                  name={isUrgent ? "alert-circle" : "information"} 
                  size={20} 
                  color={isUrgent ? "#ff6b6b" : "#00b2bc"} 
                />
              </View>
              <Text style={[styles.infoText, isUrgent && styles.urgentText]}>
                {isUrgent ? 'Urgent: Expiring Soon' : 'Available for Donation'}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Animated.sequence([
                Animated.timing(scaleAnim, {
                  toValue: 0.95,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  friction: 3,
                  tension: 40,
                  useNativeDriver: true,
                }),
              ]).start();
              handlePick();
            }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isUrgent ? ['#ff6b6b', '#ff8787'] : ['#00b2bc', '#009da6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Request Medicine</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '90%',
    maxWidth: 340,
    marginVertical: 15,
    marginHorizontal: 15,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  patternGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
  },
  patternCell: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 178, 188, 0.1)',
  },
  floatingElement1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 178, 188, 0.05)',
    top: -50,
    right: -50,
    zIndex: -1,
  },
  floatingElement2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 178, 188, 0.05)',
    bottom: -30,
    left: -30,
    zIndex: -1,
  },
  floatingElement3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 178, 188, 0.05)',
    top: 60,
    left: 40,
    zIndex: -1,
  },
  floatingElement4: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 178, 188, 0.05)',
    bottom: 40,
    right: 30,
    zIndex: -1,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  topSection: {
    position: 'relative',
    height: 160,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  medicineImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  expiryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  expiryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00b2bc',
    zIndex: 1,
  },
  urgentStatus: {
    backgroundColor: '#ff6b6b',
  },
  statusDot: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  contentSection: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  concentration: {
    fontSize: 15,
    color: '#666666',
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00b2bc',
    marginLeft: 6,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urgentIcon: {
    backgroundColor: '#fff5f5',
  },
  infoText: {
    fontSize: 15,
    color: '#555555',
  },
  urgentText: {
    color: '#ff6b6b',
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});

export default MedicineDonationCard;