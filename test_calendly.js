const fetch = require('node-fetch');

async function testCalendly(token) {
    try {
        console.log('Fetching user info...');
        const userRes = await fetch('https://api.calendly.com/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!userRes.ok) {
            console.error('Failed to fetch user:', await userRes.text());
            return;
        }
        
        const userData = await userRes.json();
        const userUri = userData.resource.uri;
        console.log('User URI:', userUri);
        
        console.log('Fetching event types...');
        const eventRes = await fetch(`https://api.calendly.com/event_types?user=${userUri}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!eventRes.ok) {
            console.error('Failed to fetch event types:', await eventRes.text());
            return;
        }
        
        const eventData = await eventRes.json();
        console.log('--- EVENT TYPES ---');
        eventData.collection.forEach(type => {
            if (type.active) {
                console.log(`- ${type.name} (${type.duration} min): ${type.scheduling_url}`);
            }
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

const token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzc1MTEwMDgzLCJqdGkiOiIxNGZiNTRhOC05Y2JhLTRiZjItYWRlZS0zOGQyMmQzNTE2MjIiLCJ1c2VyX3V1aWQiOiIwMWNkYjRiZi0yNDJjLTQ5ZGYtYjQxMS0xOGYxMzg0ZDMxMGUiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUgYWN0aXZpdHlfbG9nOnJlYWQgZGF0YV9jb21wbGlhbmNlOndyaXRlIG91dGdvaW5nX2NvbW11bmljYXRpb25zOnJlYWQifQ.Tk4Wl-5aHw04qgu9anCBXHfmf6jLkt1X0L8NgrGhs4t78pB41ab-4KeTJOhScIXH-nAWyQfOHAu5BTLSxJblzA';
testCalendly(token);
