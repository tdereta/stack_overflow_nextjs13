import React from 'react';

interface AvatarProps {
    name: string;
}

const Avatar: React.FC<AvatarProps> = ({ name }) => {
    const initials = name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('');

    return (
        <div className="avatar">
            <span className="avatar__initials">{initials}</span>
        </div>
    );
};

export default Avatar;