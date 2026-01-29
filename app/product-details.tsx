import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, Tag, Heart, Globe, Leaf } from 'lucide-react-native';
import { getPerfumeById } from '@/lib/api';
import { Perfume } from '@/types/database';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [perfume, setPerfume] = useState<Perfume | null>(null);

    useEffect(() => {
        if (id) fetchPerfume();
    }, [id]);

    const fetchPerfume = async () => {
        try {
            const data = await getPerfumeById(id as string);
            setPerfume(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!perfume) return <View style={styles.container} />;

    const formatText = (text: string) => {
        return text?.replace(/_/g, ' ');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={styles.imageContainer}>
                    {perfume.image_url ? (
                        <Image
                            source={{ uri: perfume.image_url }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.image, { backgroundColor: '#1A1A2E' }]} />
                    )}
                    <LinearGradient colors={['transparent', '#0A0A0F']} style={styles.gradientOverlay} />

                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft color="#FFF" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.brand}>{perfume.brand}</Text>
                    <Text style={styles.name}>{perfume.name}</Text>
                    <Text style={styles.price}>${perfume.price.toFixed(2)}</Text>

                    <Text style={styles.sectionTitle}>Scent Profile</Text>
                    <View style={styles.profileContainer}>

                        <View style={styles.profileRow}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 201, 240, 0.1)' }]}>
                                <Tag size={20} color="#4CC9F0" />
                            </View>
                            <View style={styles.profileTextContainer}>
                                <Text style={styles.profileLabel}>Olfactory Family</Text>
                                <Text style={styles.profileValue}>{perfume.category}</Text>
                            </View>
                        </View>

                        <View style={styles.profileRow}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 107, 157, 0.1)' }]}>
                                <Heart size={20} color="#FF6B9D" />
                            </View>
                            <View style={styles.profileTextContainer}>
                                <Text style={styles.profileLabel}>Emotional Impact</Text>
                                <Text style={styles.profileValue}>{perfume.emotional_impact}</Text>
                            </View>
                        </View>

                        {perfume.vr_environment && (
                            <View style={styles.profileRow}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(160, 232, 175, 0.1)' }]}>
                                    <Globe size={20} color="#A0E8AF" />
                                </View>
                                <View style={styles.profileTextContainer}>
                                    <Text style={styles.profileLabel}>Virtual World</Text>
                                    <Text style={[styles.profileValue, { textTransform: 'capitalize' }]}>
                                        {formatText(perfume.vr_environment)}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>About the Fragrance</Text>
                    <Text style={styles.description}>{perfume.description}</Text>

                    <View style={styles.sustainabilityBadge}>
                        <Leaf size={16} color="#4CC9F0" />
                        <Text style={styles.sustainabilityText}>Sustainably Sourced Ingredients</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.arButton}
                    onPress={() => router.push(`/ar-experience?perfumeId=${perfume.id}`)}
                >
                    <LinearGradient
                        colors={[perfume.aura_color || '#FF6B9D', '#1A1A2E']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Sparkles color="#FFF" size={20} />
                        <Text style={styles.buttonText}>Start Aura Experience</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0F'
    },
    imageContainer: {
        width: width,
        height: 400,
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0, left: 0,
        right: 0,
        height: 150
    },
    backButton: {
        position: 'absolute',
        top: 60, left: 24,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20
    },
    content: {
        padding: 24,
        marginTop: -40
    },
    brand: {
        color: '#999',
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8
    },
    name: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8
    },
    price: {
        color: '#FF6B9D',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 32
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginTop: 8
    },
    profileContainer: {
        backgroundColor: '#1A1A2E',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        gap: 20
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileTextContainer: {
        flex: 1
    },
    profileLabel: {
        color: '#999',
        fontSize: 12,
        marginBottom: 2
    },
    profileValue: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '500'
    },
    description: {
        color: '#CCC',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24
    },
    sustainabilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(76, 201, 240, 0.1)',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    sustainabilityText: {
        color: '#4CC9F0',
        fontSize: 13,
        fontWeight: '500'
    },
    footer: {
        position: 'absolute',
        bottom: 0, left: 0,
        right: 0, padding: 24,
        backgroundColor: '#0A0A0F',
        borderTopWidth: 1,
        borderTopColor: '#1A1A2E'
    },
    arButton: {
        borderRadius: 16,
        overflow: 'hidden'
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18, gap: 10
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700'
    },
});