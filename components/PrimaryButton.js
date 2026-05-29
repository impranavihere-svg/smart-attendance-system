import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrimaryButton({
  title,
  onPress,
  icon = 'arrow-forward-circle',
  disabled = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        <Ionicons name={icon} size={18} color="#FFFFFF" />
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginVertical: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
