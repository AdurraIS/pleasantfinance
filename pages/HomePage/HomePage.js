import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { ScrollView, View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import OnboardingItem from '../../components/OnboardingItem/OnboardingItem';
import ProgressCircle from '../../components/ProgressCircle/ProgressCircle';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../shared/CreateClient';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function HomePage({ userData, setUserData, metasData, cardsData, setCardsData }) {
    const navigation = useNavigation();
    const [userDataHome, setUserDataHome] = useState([]);
    const [balance, setBalance] = useState(8.5);
    const route = useRoute();
    const { name: currentScreen } = route;

    async function buscaDados() {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', userData.email);

            if (error) {
                throw error;
            }

            return data[0];
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    async function buscaCards(IdWallet) {
        try {
            const { data, error } = await supabase
                .from('cartoes')
                .select('*')
                .eq('idUsuario', IdWallet);

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const userDataResult = await buscaDados();
                setUserData(userDataResult);
                setUserDataHome(userDataResult);

                const cardsResult = await buscaCards(userDataResult.idWallet);
                setCardsData(cardsResult);
            } catch (error) {
                console.error(error.message);
            }
        }

        if (currentScreen === 'HomePage') {
            fetchData();
        }
    }, []);

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scroll} >
                <Image
                    style={styles.topBackgroundImage}
                    source={require('../../assets/Backgrounds/background.png')}
                />
                <View style={styles.containerCards}>
                    <View style={[styles.header]}>
                        <View>
                            <Text style={[styles.textH2, { fontSize: 14, fontWeight: 200, marginBottom: 10 }]}>Welcome Back</Text>
                            <Text style={styles.textH2}>{userDataHome.fullName}</Text>
                        </View>
                        <Image
                            style={styles.icones1}
                            source={require('../../assets/icones/notificationicon.png')}
                        />
                    </View>

                    <View style={styles.pagamentos}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 10, marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, color: '#840F74' }}>My Balance</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#840F74' }}>{balance} ETH</Text>
                        </View>
                        <View style={{ width: '90%', backgroundColor: '#F2F2F2', height: 2 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 20 }}>
                            <View style={[styles.divBotoes]}>
                                <Image
                                    style={styles.icones}
                                    source={require('../../assets/icones/Home/EnviarIcon.png')}
                                />
                                <Text style={styles.textH3}>Send</Text>
                            </View>
                            <View style={[styles.divBotoes]}>
                                <Image
                                    style={styles.icones}
                                    source={require('../../assets/icones/Home/RequestIcon.png')}
                                />
                                <Text style={styles.textH3}>Request</Text>
                            </View>
                            <View style={[styles.divBotoes]}>
                                <Image
                                    style={styles.icones}
                                    source={require('../../assets/icones/Home/PayIcon.png')}
                                />
                                <Text style={styles.textH3}>Pay</Text>
                            </View>
                            <View style={[styles.divBotoes]}>
                                <Image
                                    style={styles.icones}
                                    source={require('../../assets/icones/Home/TopUpIcon.png')}
                                />
                                <Text style={styles.textH3}>Top Up</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: screenWidth, paddingHorizontal: 30, paddingVertical: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#840F74' }}>Your Cards</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllCards')}>
                            <Text style={{ fontSize: 14, color: '#840F74' }}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.cartoes, cardsData.length == 0 && styles.padding]}>
                        {cardsData.length > 0 ? (<FlatList
                            data={cardsData}
                            renderItem={({ item }) => <OnboardingItem item={item} />}
                            horizontal
                            snapToAlignment='start'
                            scrollEventThrottle={16}
                            decelerationRate="fast"
                            snapToOffsets={cardsData && cardsData.map((_, i) => i * (304 - 15) + (i - 1) * 40)}
                            showsHorizontalScrollIndicator={false}
                        />) : (<TouchableOpacity onPress={() => navigation.navigate('AllCards')}>
                            <Text style={{ fontSize: 14, color: '#840F74' }}>Add Cards</Text>
                        </TouchableOpacity>)}

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: screenWidth, paddingHorizontal: 30, paddingVertical: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#840F74' }}>Your Goals</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllGoals')}>
                            <Text style={{ fontSize: 14, color: '#840F74' }}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.marginBottom, styles.pagamentosDiv]}>
                        {metasData.length > 0 ? metasData.map((meta) => {
                            return (
                                <TouchableOpacity key={meta.id} onPress={() => navigation.navigate('meta/' + meta.id)} >
                                    <View style={styles.cardGoals}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <Image style={{ width: 48, height: 48, borderRadius: 30 }} source={meta.imageMeta} />
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#840F74' }}>{meta.titulo}</Text>
                                        </View>
                                        <ProgressCircle size={48} progress={meta.valorAtual / meta.valorMeta} />
                                    </View>
                                </TouchableOpacity>

                            );
                        }) : (<TouchableOpacity onPress={() => navigation.navigate('AllGoals')}>
                            <Text style={{ fontSize: 14, color: '#840F74' }}>Add Goals</Text>
                        </TouchableOpacity>)}

                    </View>
                </View>

            </ScrollView>
        </View >

    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingTop: 60,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        width: screenWidth,
        alignItems: 'center',
        marginBottom: 35
    },
    bottom: {
        position: 'fixed',
        bottom: 0
    },
    scroll: {
        width: screenWidth,
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
    },
    topBackgroundImage: {
        position: 'absolute',
        height: screenHeight + 59,
        width: screenWidth,
        resizeMode: 'contain',
        top: 0,
        left: 0
    },
    containerCards: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        marginBottom: 20,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 40,
    },
    textH2: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff'
    },
    textH3: {
        fontSize: 15,
        fontWeight: '400',
    },
    icones1: {
        width: 24,
        height: 24,
    },
    icones: {
        width: 46,
        height: 46,
    },
    cartoes: {
        height: 200,
        overflow: 'visible',
        width: screenWidth
    },
    padding: {
        paddingHorizontal: 30
    },
    pagamentos: {
        borderWidth: 1,
        borderColor: 'rgba(242, 242, 242, 0.5)',
        flexDirection: 'col',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        width: '80%',
        borderRadius: 10,
    },
    FlexColumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    divBotoes: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    pagamentosDiv: {
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'space-around',
        width: '80%',
        position: 'relative',
    },
    cardGoals: {
        borderWidth: 1,
        borderColor: 'rgba(242, 242, 242, 0.3)',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        marginTop: 20
    },
    marginBottom: {
        marginBottom: 50
    }
});

export default HomePage;
