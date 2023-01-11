import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { margin, padding } from '../../utils/cssUtils';

type User = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
};

function User({ isSelected, item, onPress }: { isSelected: boolean; item: User; onPress: () => void | undefined }) {
    const { firstName, lastName, age, gender, email, username } = item;
    const backgroundColor = { backgroundColor: isSelected ? '#08b' : '#fff' };
    const color = { color: isSelected ? '#fff' : '#000', fontSize: 12 };
    return (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <View style={styles.userRow}>
                <Text style={[styles.bold, color]}>{`${firstName} ${lastName}`}</Text>
                <Text style={[color]}>{email}</Text>
            </View>
            <View style={[styles.userRow, styles.vspacer]}>
                <Text style={[color]}>Username: {username}</Text>
                <Text style={[color]}>{`${gender}, ${age}`}</Text>
            </View>
        </TouchableOpacity>
    );
}

function Users() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetch('https://dummyjson.com/users')
            .then(res => res.json())
            .then(json => {
                setUsers(json.users);
            });
    }, []);

    const renderItem = ({ item }: { item: User }) => {
        return <User isSelected={item.id === selectedId} item={item} onPress={() => setSelectedId(item.id)} />;
    };

    const filter = searchQuery.toLowerCase();
    const filteredUsers = searchQuery
        ? users.filter(
              ({ firstName, lastName }) =>
                  firstName.toLowerCase().includes(filter) || lastName.toLowerCase().includes(filter)
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
        borderRadius: 10,
        color: '#000'
    },
    userRow: {
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
        borderRadius: 10,
        ...margin(2, 5),
        backgroundColor: '#cfc'
    }
});

export default Users;
