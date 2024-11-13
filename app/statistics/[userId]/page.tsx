import { getUserId } from '@/actions/getUserId';
import DetailUserAnswer from '@/components/exam/DetailUserAnswer';
import DetailAnswer from '@/components/exams/DetailAnswer';
import UserInfo from '@/components/user/UserInfo';
import React from 'react';

interface UserPageProps {
    params: {
        userId: string;
    };
}

const User = async ({ params }: UserPageProps) => {
    const user = await getUserId(params.userId);

    if (!user || 'message' in user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <UserInfo userId={user.id}/>

            {/* Pass userId as prop to DetailUserAnswer */}
            
            <DetailAnswer userId={user.id}/>

            
            
        </div>
    );
};

export default User;
