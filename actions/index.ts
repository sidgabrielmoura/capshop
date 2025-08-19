interface NotificationInterface {
    userId: string
    title: string
    message: string
    type: string
}

export async function createNotification({ ...props }: NotificationInterface) {
    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(props)
        })

        if (response.ok) {
            return
        }

    } catch (error) {
        console.error("Error creating notification:", error)
    }
}

export const fetchNotifications = async () => {
    const res = await fetch(`/api/notifications`);
    const data = await res.json();

    return data
}