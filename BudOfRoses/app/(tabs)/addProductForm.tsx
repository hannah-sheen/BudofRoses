import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import {database} from './firebaseConfig'
import { ref, push} from 'firebase/database';

const AddProductForm = ({}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

 const handleSubmit = async () => {
    if (
      !productName.trim() ||
      !description.trim() ||
      !price ||
      !quantity ||
      !category ||
      !image ||
      Object.values(sizes).every((val) => !val)
    ) {
      alert('Please fill in all fields and select at least one size.');
      return;
    }

    const productData = {
      productName,
      description,
      price: parseFloat(price),
      stocks: parseInt(quantity),
      category,
      sizes: Object.keys(sizes).filter((size) => sizes[size as keyof typeof sizes]),
      image,
      createdAt: new Date().toISOString(),
      sales: 0,
    };

    try {
      setLoading(true); 

      const productListRef = ref(database, 'productlist');
      await push(productListRef, productData);

      setLoading(false);
      alert('Product added successfully!');
      router.push('/productList');
    } catch (error) {
      console.error('Error adding product:', error);
      setLoading(false);
      alert('Failed to add product.');
    }
  };


  if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Ionicons name="refresh-circle" size={60} color="#4B3130" />
      <Text style={[styles.loadingText, { fontFamily: 'Poppins_500Medium' }]}>Adding product...</Text>
    </View>
  );
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/productList')}
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
            <Ionicons name="camera" size={40} color="#888" />
            <Text style={styles.uploadText}>Tap to upload product image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Name */}
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Price */}
      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Quantity */}
      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Available Stocks</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter available quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {/* Size Options */}
      <Text style={styles.label}>Available Sizes</Text>
      <View style={styles.checkboxContainer}>
        {Object.keys(sizes).map((size) => (
          <View key={size} style={styles.checkboxWrapper}>
             <Checkbox
              value={sizes[size as keyof typeof sizes]}
              onValueChange={() => handleSizeChange(size as keyof typeof sizes)}
              color={sizes[size as keyof typeof sizes] ? '#4B3130' : undefined}
            />
            <Text style={styles.checkboxLabel}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Product</Text>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  imageUpload: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#DBA6B6',
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
    color: '#888',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
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
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#DBA6B6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
  marginTop: 10,
  fontSize: 18,
  color: '#4B3130',
},
});

export default AddProductForm;