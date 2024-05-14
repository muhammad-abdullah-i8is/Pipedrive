const express = require('express');
const cors = require('cors');
const PORT = 5000;
const Imap = require('imap');
const { simpleParser } = require('mailparser');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const imapConfig = {
    user: 'abdullah@i8is.com',
    password: 'abdullah@150357',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false, // Optional, but keep it for self-signed certificates
        servername: 'imap.gmail.com' // Use a single tlsOptions object
    },
    authTimeout: 30000, // Increase authTimeout if needed
    requireTLS: true // Enable STARTTLS
};

const getEmails = async () => {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once('error', err => {
            console.error('IMAP error:', err);
            reject(err);
        });

        imap.once('end', () => {
            console.log('IMAP connection ended');
        });

        imap.once('ready', () => {
            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    imap.end();
                    return reject(err);
                }
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().split('T')[0];
                imap.search(['SEEN', ['ON', formattedDate]], (err, results) => {
                    if (err) {
                        imap.end();
                        return reject(err);
                    }

                    if (!results || results.length === 0) {
                        imap.end();
                        return resolve([]); // No emails found for the current date
                    }

                    const f = imap.fetch(results, { bodies: '' });
                    const emails = [];

                    f.on('message', msg => {
                        let email = {
                            from: '',
                            subject: '',
                            date: ''
                        };

                        msg.on('body', stream => {
                            simpleParser(stream, (err, parsed) => {
                                if (err) {
                                    console.error('Error parsing email:', err);
                                    return reject(err);
                                }
                                email = {
                                    from: parsed.from?.text || '',
                                    subject: parsed.subject || '',
                                    date: parsed.date || ''
                                };
                            });
                        });

                        msg.once('attributes', attrs => {
                            const { uid } = attrs;
                            imap.addFlags(uid, ['\\Seen'], () => {
                                console.log('Marked as read:', email.subject);
                            });
                        });

                        msg.once('end', () => {
                            if (email.subject && email.date) {
                                console.log('Email Subject:', email.subject);
                                console.log('Email Date:', email.date);
                            }
                            emails.push(email);
                        });
                    });

                    f.once('error', ex => {
                        imap.end();
                        reject(ex);
                    });

                    f.once('end', () => {
                        console.log('Done fetching all messages!');
                        imap.end();
                        resolve(emails);
                    });
                });
            });
        });

        imap.connect();
    });
};



// Route to trigger getEmails function
app.get('/fetch-emails', async (req, res) => {
    try {
        const emails = await getEmails();
        console.log("emails =======>", emails);
        res.status(200).json({
            status: 200,
            message: 'Emails fetched',
            success: true,
            total: emails?.length,
            results: emails
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(400).json({
            status: 400,
            message: 'Error fetching emails',
            success: false,
            total: 0
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
