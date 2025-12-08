import React, { useEffect, useState } from 'react';
import { MockBackend } from '../services/mockDataService';
import { AthleteProfile } from '../types';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<AthleteProfile | null>(null);

    useEffect(() => {
        MockBackend.getAthleteProfile().then(setProfile);
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div className="px-8 pb-8">
                <div className="relative -top-12 mb-[-30px]">
                    <img src={profile.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover bg-gray-200" />
                </div>
                
                <div className="mt-4">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{profile.name}</h2>
                    <p className="text-emerald-600 dark:text-emerald-400 font-medium">{profile.sport}</p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-6 text-center border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{profile.age}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{profile.heightCm} cm</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{profile.weightKg} kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;