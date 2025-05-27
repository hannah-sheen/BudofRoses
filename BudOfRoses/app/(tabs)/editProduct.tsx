import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from './firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const EditProductForm = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('Roses');
  const [image, setImage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!productId) {
      alert('No product ID provided');
      router.back();
      return;
    }

    const productRef = ref(database, `productlist/${productId}`);
    const unsubscribe = onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProductName(data.productName);
        setDescription(data.description || '');
        setPrice(data.price.toString());
        setQuantity(data.stocks.toString());
        setCategory(data.category || 'Roses');
        setImage(data.image || null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

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

  const handleSubmit = async () => {
    if (
      !productName.trim() ||
      !price ||
      !quantity ||
      !category ||
      !image
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const productData = {
      productName,
      description,
      price: parseFloat(price),
      stocks: parseInt(quantity),
      category,
      image,
    };

    try {
      setSaving(true);
      const productRef = ref(database, `productlist/${productId}`);
      await update(productRef, productData);

      alert('Product updated successfully!');
      router.push('/productDetails');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3130" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.push('/productDetails')}
      >
        <Ionicons name="arrow-back" size={24} color="#4B3130" />
      </TouchableOpacity>

      <Text style={[styles.header, { fontFamily: 'Poppins_600SemiBold' }]}>Edit Product</Text>

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

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Price (₱)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { fontFamily: 'Poppins_500Medium' }]}>Available Stocks</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter available quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

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

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save Changes</Text>
        )}
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
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#F0DCD3',
  },
  backButton: {
    position: 'absolute',
    top: 40,
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
});

export default EditProductForm;
