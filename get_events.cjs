const https = require('https');

const token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzc1MTEwMDgzLCJqdGkiOiIxNGZiNTRhOC05Y2JhLTRiZjItYWRlZS0zOGQyMmQzNTE2MjIiLCJ1c2VyX3V1aWQiOiIwMWNkYjRiZi0yNDJjLTQ5ZGYtYjQxMS0xOGYxMzg0ZDMxMGUiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIHdlYmhvb2tzOnJlYWQgd2ViaG9va3M6d3JpdGUgYWN0YXZpdHlfbG9nOnJlYWQgZGF0YV9jb21wbGlhbmNlOndyaXRlIG91dGdvaW5nX2NvbW11bmljYXRpb25zOnJlYWQifQ.Tk4Wl-5aHw04qgu9anCBXHfmf6jLkt1X0L8NgrGhs4t78pB41ab-4KeTJOhScIXH-nAWyQfOHAu5BTLSxJblzA';
const userUri = 'https://api.calendly.com/users/01cdb4bf-242c-49df-b411-18f1384d310e';

function getEventTypes() {
    const options = {
        hostname: 'api.calendly.com',
        path: `/event_types?user=${userUri}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(JSON.stringify(json.collection.map(t => ({
                    name: t.name,
                    duration: t.duration,
                    url: t.scheduling_url,
                    active: t.active
                })), null, 2));
            } catch (e) {
                console.error('Parse error:', e);
                console.log('Raw data:', data);
            }
        });
    });

    req.on('error', error => console.error('Error:', error));
    req.on('timeout', () => {
        req.destroy();
        console.error('Timeout');
    });
    req.end();
}

getEventTypes();
