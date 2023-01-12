import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { margin, padding } from '../../utils/cssUtils';

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
    const { title, description, price, brand, category } = item;
    const backgroundColor = { backgroundColor: isSelected ? '#08b' : '#fff' };
    const color = { color: isSelected ? '#fff' : '#000', fontSize: 12 };
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <View style={[styles.itemRow]}>
                <Text style={[styles.bold, color]}>{title}</Text>
                <Text style={[color]}>${price}</Text>
            </View>
            <Text style={[color, styles.vspacer]}>{description}</Text>
            <View style={[styles.itemRow, styles.vspacer]}>
                <Text style={[color]}>Brand: {brand}</Text>
                <Text style={[color]}>{category}</Text>
            </View>
        </TouchableOpacity>
    );
}

export function Products() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [users, setUsers] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetch('https://dummyjson.com/products')
            .then(res => res.json())
            .then(json => {
                setUsers(json.products);
            });
    }, []);

    const renderItem = ({ item }: { item: Product }) => {
        return <Product isSelected={item.id === selectedId} item={item} onPress={() => setSelectedId(item.id)} />;
    };

    const filter = searchQuery.toLowerCase();
    const filteredUsers = searchQuery
        ? users.filter(({ title, brand, category }) =>
              [title, brand, category].some(s => s?.toLowerCase().includes(filter))
          )
        : users;

    return (
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#777'
        // marginTop: 2
    },
    item: {
        ...padding(4, 8),
        ...margin(3, 5),
        borderRadius: 5,
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
    }
});
