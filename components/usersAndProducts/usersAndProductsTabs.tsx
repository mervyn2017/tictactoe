import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Users } from './userList';
import { Products } from './productList';

const Tab = createMaterialTopTabNavigator();

function UsersAndProductsTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 14 },
                tabBarStyle: { backgroundColor: '#fff' }
            }}>
            <Tab.Screen name="Users" component={Users} />
            <Tab.Screen name="Products" component={Products} />
        </Tab.Navigator>
    );
}

export default UsersAndProductsTabs;
