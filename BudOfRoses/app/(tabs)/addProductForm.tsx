import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const AddProductForm = ({}) => {
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Roses');
  const [image, setImage] = useState<string | null>(null);
  const [sizes, setSizes] = useState({
    small: false,
    medium: false,
    large: false
  });

  const categories = [
    'Roses',
    'Tulips',
    'Lilies',
    'Orchids',
    'Daisies',
    'Carnations',
    'Sunflowers',
    'Mixed Bouquets',
    'Exotic Flowers',
    'Dried Flowers'
  ];

  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSizeChange = (size: keyof typeof sizes) => {
    setSizes(prev => ({
      ...prev,
      [size]: !prev[size]
    }));
  };

  const handleSubmit = () => {
    const productData = {
      productName,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      sizes: Object.keys(sizes).filter(size => sizes[size as keyof typeof sizes]),
      image
    };
    console.log('Product Data:', productData);
    // Here you would typically send the data to your backend
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/(tabs)/productList')}
      >
        <Ionicons name="arrow-back" size={24} color="#4B3130" />
      </TouchableOpacity>

      <Text style={[styles.header, { fontFamily: 'Poppins_600SemiBold' }]}>Add New Product</Text>

      {/* Product Image */}
      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={40} color="#4B3130" />
            <Text style={[styles.uploadText, { fontFamily: 'Poppins_400Regular' }]}>Tap to upload product image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Name */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Product Name</Text>
      <TextInput
        style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
        placeholder="Enter product name"
        placeholderTextColor="#888"
        value={productName}
        onChangeText={setProductName}
      />

      {/* Description */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput, { fontFamily: 'Poppins_400Regular' }]}
        placeholder="Enter product description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Price */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Price (₱)</Text>
      <TextInput
        style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
        placeholder="Enter price"
        placeholderTextColor="#888"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Quantity */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Available Quantity</Text>
      <TextInput
        style={[styles.input, { fontFamily: 'Poppins_400Regular' }]}
        placeholder="Enter available quantity"
        placeholderTextColor="#888"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Category Dropdown */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={[styles.picker, { fontFamily: 'Poppins_400Regular' }]}
        >
          {categories.map((cat) => (
            <Picker.Item 
              key={cat} 
              label={cat} 
              value={cat}
            />
          ))}
        </Picker>
      </View>

      {/* Size Options */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Available Sizes</Text>
      <View style={styles.checkboxContainer}>
        {Object.keys(sizes).map((size) => (
          <View key={size} style={styles.checkboxWrapper}>
            <Checkbox
              value={sizes[size as keyof typeof sizes]}
              onValueChange={() => handleSizeChange(size as keyof typeof sizes)}
              color={sizes[size as keyof typeof sizes] ? '#4B3130' : undefined}
            />
            <Text style={[styles.checkboxLabel, { fontFamily: 'Poppins_400Regular' }]}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={[styles.submitButtonText, { fontFamily: 'Poppins_600SemiBold' }]}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0DCD3',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#F0DCD3',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B3130',
    marginTop: 10,
  },
  imageUpload: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#4B3130',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  uploadText: {
    marginTop: 10,
    color: '#4B3130',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4B3130',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4B3130',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#4B3130',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#4B3130',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    color: '#4B3130',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33%',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#4B3130',
  },
  submitButton: {
    backgroundColor: '#4B3130',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddProductForm;