import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { border, margin, padding } from '../../utils/cssUtils';
import { fetchItems } from '../../utils/http';

type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
};

function Product({
    isSelected,
    item,
    onPress
}: {
    isSelected: boolean;
    item: Product;
    onPress: () => void | undefined;
}) {
    const { title, description, price, brand, category, thumbnail } = item;
    const backgroundColor = { backgroundColor: isSelected ? '#08b' : '#fff' };
    const color = { color: isSelected ? '#fff' : '#000', fontSize: 14 };
    const image = { uri: thumbnail };
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <View style={[styles.itemRow]}>
                <Text style={[styles.bold, color]}>{title}</Text>
                <Text style={[styles.bold, color]}>${price}</Text>
            </View>
            <View style={[styles.itemRow, styles.vspacer]}>
                <Text style={[color]}>Brand: {brand}</Text>
                <Text style={[color]}>{category}</Text>
            </View>
            <View style={[styles.itemRow, styles.vspacer]}>
                <Text style={[styles.prodDesc, color]}>{description}</Text>
                <Image style={styles.smallImage} source={image} />
            </View>
        </TouchableOpacity>
    );
}

async function fetchProducts(): Promise<any> {
    const json = await fetchItems('https://dummyjson.com/products');
    if (!json?.products) {
        throw new Error('Failed to retrieve products');
    }
    return json.products;
}

export function Products() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchProducts()
            .then(json => {
                setProducts(json);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const renderItem = ({ item }: { item: Product }) => {
        return <Product isSelected={item.id === selectedId} item={item} onPress={() => setSelectedId(item.id)} />;
    };

    const filter = searchQuery.toLowerCase();
    const filteredUsers = searchQuery
        ? products.filter(({ title, brand, category }) =>
              [title, brand, category].some(s => s?.toLowerCase().includes(filter))
          )
        : products;

    return (
        <SafeAreaView style={styles.container}>
            {products.length ? (
                <>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        style={styles.searchbar}
                    />
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id + ''}
                        extraData={selectedId}
                    />
                </>
            ) : (
                <ActivityIndicator size="large" color="#00f" />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    item: {
        ...padding(4, 8),
        ...margin(3, 5),
        ...border(1, '#666', 5),
        color: '#000'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: 'red'
    },
    bold: {
        fontWeight: 'bold'
    },
    vspacer: {
        marginTop: 10
    },
    searchbar: {
        borderRadius: 5,
        ...margin(2, 5),
        backgroundColor: '#efe'
    },
    prodDesc: {
        flex: 1,
        marginRight: 5
    },
    smallImage: {
        width: 100,
        height: 80
    }
});
