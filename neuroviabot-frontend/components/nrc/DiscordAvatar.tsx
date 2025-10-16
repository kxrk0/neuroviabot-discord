'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface DiscordAvatarProps {
    userId: string;
    avatar?: string;
    username?: string;
    size?: number;
    showServer?: boolean;
    serverIcon?: string | null;
}

export default function DiscordAvatar({
    userId,
    avatar,
    username,
    size = 48,
    showServer = false,
    serverIcon
}: DiscordAvatarProps) {
    const [imgError, setImgError] = useState(false);

    const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(userId || '0') % 5}.png`;
    const avatarUrl = imgError ? defaultAvatar : (avatar || defaultAvatar);

    return (
        <div className="discord-avatar-container" style={{ width: size, height: size }}>
            <motion.div
                className="avatar-wrapper"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Image
                    src={avatarUrl}
                    alt={username || 'User'}
                    width={size}
                    height={size}
                    className="user-avatar"
                    onError={() => setImgError(true)}
                    unoptimized
                />
                {showServer && serverIcon && (
                    <div className="server-badge">
                        <Image
                            src={serverIcon}
                            alt="Server"
                            width={size / 2}
                            height={size / 2}
                            className="server-icon"
                            unoptimized
                        />
                    </div>
                )}
            </motion.div>

            <style jsx>{`
                .discord-avatar-container {
                    position: relative;
                    display: inline-block;
                }

                .avatar-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .user-avatar {
                    border-radius: 50%;
                    object-fit: cover;
                }

                .server-badge {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    background: #1E1F22;
                    border-radius: 50%;
                    padding: 2px;
                    border: 2px solid #0F0F14;
                }

                .server-icon {
                    border-radius: 50%;
                    object-fit: cover;
                }
            `}</style>
        </div>
    );
}

