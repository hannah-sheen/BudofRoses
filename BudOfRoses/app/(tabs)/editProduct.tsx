import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from './firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  productName: yup.string().required('Product name is required'),
  description: yup.string().nullable(),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .required('Quantity is required'),
  category: yup
    .string()
    .notOneOf(['Select'], 'Please select a valid category')
    .required('Category is required'),
});

const EditProductForm = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      productName: '',
      description: '',
      price: 0,
      quantity: 0,
      category: 'Select',
    },
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
        setValue('productName', data.productName);
        setValue('description', data.description || '');
        setValue('price', data.price.toString());
        setValue('quantity', data.stocks.toString());
        setValue('category', data.category || 'Select');
        setImage(data.image || null);
        setOriginalData({
          productName: data.productName,
          description: data.description || '',
          price: data.price.toString(),
          quantity: data.stocks.toString(),
          category: data.category || 'Select',
          image: data.image || null,
        });
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

  const onSubmit = async (data: any) => {
    if (!image) {
      alert('Please upload an image.');
      return;
    }

    const parsedData = {
      productName: data.productName.trim(),
      description: data.description?.trim() || '',
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
      category: data.category,
      image: image,
    };

    const originalParsed = {
      productName: originalData.productName.trim(),
      description: originalData.description?.trim() || '',
      price: parseFloat(originalData.price),
      quantity: parseInt(originalData.quantity),
      category: originalData.category,
      image: originalData.image,
    };

    const keys: (keyof typeof parsedData)[] = [
      'productName',
      'description',
      'price',
      'quantity',
      'category',
      'image',
    ];
    const changesMade = keys.some(
      (key) => parsedData[key] !== originalParsed[key]
    );

    if (!changesMade) {
      Alert.alert('No changes made', 'Please modify some fields before saving.');
      return;
    }

    try {
      setSaving(true);
      const productRef = ref(database, `productlist/${productId}`);
      await update(productRef, {
        productName: parsedData.productName,
        description: parsedData.description,
        price: parsedData.price,
        stocks: parsedData.quantity,
        category: parsedData.category,
        image: parsedData.image,
      });

      Alert.alert('Success', 'Product updated successfully!');
      router.push('/productDetails');
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product.');
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/productDetails')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
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

        <Text style={styles.label}>Product Name</Text>
        <Controller
          control={control}
          name="productName"
          render={({ field: { value, onChange } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />
        {errors.productName && <Text style={styles.error}>{errors.productName.message}</Text>}

        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={value ?? ''}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

        <Text style={styles.label}>Price (₱)</Text>
        <Controller
          control={control}
          name="price"
          render={({ field: { value, onChange } }) => (
            <TextInput style={styles.input} value={value?.toString()} onChangeText={onChange} keyboardType="numeric" />
          )}
        />
        {errors.price && <Text style={styles.error}>{errors.price.message}</Text>}

        <Text style={styles.label}>Available Stocks</Text>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange } }) => (
            <TextInput style={styles.input} value={value?.toString()} onChangeText={onChange} keyboardType="numeric" />
          )}
        />
        {errors.quantity && <Text style={styles.error}>{errors.quantity.message}</Text>}

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            )}
          />
        </View>
        {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
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
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#F0DCD3',
  },
  header: {
    backgroundColor: '#4B3130',
    width: '100%',
    padding: 10,
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
    color: '#fff',
    textAlign: 'center',
    marginRight: 40,
    fontWeight: 'bold',
  },
  imageUpload: {
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#DBA6B6',
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
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
    marginBottom: 10,
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
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
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
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default EditProductForm;
