import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { database } from './firebaseConfig';
import { ref, push } from 'firebase/database';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

const schema = yup.object().shape({
  productName: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  stocks: yup
    .number()
    .typeError('Stocks must be a number')
    .min(1, 'Minimum stocks is 1')
    .required('Stocks is required'),
  category: yup
    .string()
    .notOneOf(['Select'], 'Please choose a valid category')
    .required('Category is required'),
});

const AddProductForm = () => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
  control,
  handleSubmit,
  setValue,
  reset,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
  defaultValues: {
    productName: '',
    description: '',
    price: 0,
    stocks: 0,
    category: 'Select',
  },
});

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const categories = [
    'Select',
    'Roses',
    'Tulips',
    'Lilies',
    'Orchids',
    'Daisies',
    'Carnations',
    'Sunflowers',
    'Mixed Bouquets',
    'Exotic Flowers',
    'Dried Flowers',
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

 const onSubmit = async (data: any) => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    const productData = {
      ...data,
      price: parseFloat(data.price),
      stocks: parseInt(data.stocks),
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

      // Reset form fields and image
      reset();
      setImage(null);

      router.push('/productList');
    } catch (error) {
      console.error('Error adding product:', error);
      setLoading(false);
      alert('Failed to add product.');
    }
  };


  if (!fontsLoaded) return null;
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="refresh-circle" size={60} color="#4B3130" />
        <Text style={styles.loadingText}>Adding product...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/productList')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <View style={styles.itemContainer}>
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
        <Controller
          control={control}
          name="productName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              onChangeText={onChange}
              value={value?.toString()}
            />
          )}
        />
        {errors.productName && <Text style={styles.error}>{errors.productName.message}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              onChangeText={onChange}
              value={value?.toString()}
            />
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        {/* Price */}
        <Text style={styles.label}>Price (₱)</Text>
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value?.toString()}
            />
          )}
        />
        {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

        {/* Quantity */}
        <Text style={styles.label}>Available Stocks</Text>
        <Controller
          control={control}
          name="stocks"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter stocks"
              keyboardType="numeric"
              onChangeText={onChange}
              value={value?.toString()}
            />
          )}
        />
        <Text>stocks</Text>
        {errors.stocks && <Text style={styles.error}>{errors.stocks.message}</Text>}

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker selectedValue={value} onValueChange={(val) => onChange(val)}>
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 70, // to give space for fixed header
    backgroundColor: '#F0DCD3',
  },
  header: {
    backgroundColor: '#4B3130',
    width: '100%',
    padding:10,
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginRight: 40, // to center text accounting for back button width
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
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Poppins_500Medium',
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
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_400Regular',
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
    fontFamily: 'Poppins_600SemiBold',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4B3130',
    fontFamily: 'Poppins_500Medium',
  },
  itemContainer: {
    padding: 20,
  },
    error: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
});

export default AddProductForm;
