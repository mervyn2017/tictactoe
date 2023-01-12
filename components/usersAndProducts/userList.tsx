import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { border, margin, padding } from '../../utils/cssUtils';
import { fetchItems } from '../../utils/http';

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
    const color = { color: isSelected ? '#fff' : '#000', fontSize: 14 };
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

async function fetchUsers(): Promise<any> {
    const json = await fetchItems('https://dummyjson.com/users');
    if (!json?.users) {
        throw new Error('Failed to retrieve users');
    }
    return json.users;
}

export function Users() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchUsers()
            .then(json => {
                setUsers(json);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const renderItem = ({ item }: { item: User }) => {
        return <User isSelected={item.id === selectedId} item={item} onPress={() => setSelectedId(item.id)} />;
    };

    const filter = searchQuery.toLowerCase();
    const filteredUsers = searchQuery
        ? users.filter(({ firstName, lastName }) => [firstName, lastName].some(s => s?.toLowerCase().includes(filter)))
        : users;

    return (
        <SafeAreaView style={styles.container}>
            {users.length ? (
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
        borderRadius: 5,
        ...margin(2, 5),
        backgroundColor: '#efe'
    }
});
