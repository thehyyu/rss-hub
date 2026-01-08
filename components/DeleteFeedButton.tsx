'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteFeedButton({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this feed?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/feeds/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete feed');
            }
        } catch (error) {
            console.error('Error deleting feed:', error);
            alert('Error deleting feed');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded transition-colors"
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}
