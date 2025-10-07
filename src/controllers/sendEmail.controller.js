const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);



const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// const createEmailTransporter = () => {
//   return nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // use TLS later
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS, // must be an App Password
//     },
//   });
// };

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.simply.com",
    port: 587,
    secure: false, // use TLS later
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // must be an App Password
    },
  });
};







const workflowStatusChange = async (req, res) => {

  
    res.status(200).json({ message: 'aight', error: error.message });
 
}




const capOrderEmail = (orderData) => {
  const {
    customerDetails,
    selectedOptions,
    totalPrice,
    currency,
    orderNumber,
    orderDate,
    program
  } = orderData;

  // Enhanced formatOptions to handle different value structures
  const formatOptions = (options) => {
    return Object.entries(options)
      .map(([key, value]) => {
        // Skip if value is empty, null, or false
        if (!value || value === '' || value === null || value === false) {
          return '';
        }

        // Handle nested objects with name/value properties
        if (typeof value === 'object' && value !== null) {
          // If it's an object with name property (like Roset farve)
          if (value.name) {
            return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(key)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(value.name)}</td></tr>`;
          }
          // If it's an object with multiple properties, format each one
          return Object.entries(value)
            .map(([subKey, subValue]) => {
              if (subValue && subValue !== '' && subValue !== null && subValue !== false) {
                return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(subKey)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(subValue)}</td></tr>`;
              }
              return '';
            })
            .join('');
        }

        // Handle simple values
        return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(key)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(value)}</td></tr>`;
      })
      .join('');
  };

  const formatLabel = (label) => {
    const labelMap = {
      'firstName': 'Fornavn',
      'lastName': 'Efternavn',
      'email': 'E-mail',
      'phone': 'Telefon',
      'Skolenavn': 'Skolenavn',
      'address': 'Adresse',
      'city': 'By',
      'postalCode': 'Postnummer',
      'country': 'Land',
      'notes': 'Bemærkninger',
      'deliverToSchool': 'Leveres til skole',
      'KOKARDE': 'KOKARDE',
      'Roset farve': 'Roset farve',
      'Kokarde': 'Kokarde',
      'Emblem': 'Emblem',
      'Type': 'Type',
      'TILBEHØR': 'TILBEHØR',
      'Hueæske': 'Hueæske',
      'Premium æske': 'Premium æske',
      'Huekuglepen': 'Huekuglepen',
      'Silkepude': 'Silkepude',
      'Ekstra korkarde': 'Ekstra korkarde',
      'Ekstra korkarde Text': 'Ekstra korkarde tekst',
      'Handsker': 'Handsker',
      'Stor kuglepen': 'Stor kuglepen',
      'Store kuglepen': 'Store kuglepen',
      'Smart Tag': 'Smart Tag',
      'Lyskugle': 'Lyskugle',
      'Luksus champagneglas': 'Luksus champagneglas',
      'Fløjte': 'Fløjte',
      'Trompet': 'Trompet',
      'Bucketpins': 'Bucketpins',
      'STØRRELSE': 'STØRRELSE',
      'Vælg størrelse': 'Vælg størrelse',
      'Millimeter tilpasningssæt': 'Millimeter tilpasningssæt',
      'UDDANNELSESBÅND': 'UDDANNELSESBÅND',
      'Huebånd': 'Huebånd',
      'Materiale': 'Materiale',
      'Hagerem': 'Hagerem',
      'Hagerem Materiale': 'Hagerem Materiale',
      'Broderi farve': 'Broderi farve',
      'Knap farve': 'Knap farve',
      'år': 'år',
      'BRODERI': 'BRODERI',
      'Broderifarve': 'Broderifarve',
      'Skolebroderi farve': 'Skolebroderi farve',
      'Ingen': 'Ingen',
      'BETRÆK': 'BETRÆK',
      'Farve': 'Farve',
      'Topkant': 'Topkant',
      'Kantbånd': 'Kantbånd',
      'Stjerner': 'Stjerner',
      'SKYGGE': 'SKYGGE',
      'Skyggebånd': 'Skyggebånd',
      'FOER': 'FOER',
      'Svederem': 'Svederem',
      'Sløjfe': 'Sløjfe',
      'Foer': 'Foer',
      'SatinType': 'Satin Type',
      'SilkeType': 'Silke Type',
      'EKSTRABETRÆK': 'EKSTRABETRÆK',
      'Tilvælg': 'Tilvælg'
    };
    return labelMap[label] || label;
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      // Prefer showing "name" if it exists
      if (value.name) return value.name;
      if (value.value) return value.value;
      return JSON.stringify(value); // fallback
    }
    if (typeof value === 'boolean') {
      return value ? 'Ja' : 'Nej';
    }
    if (value === '') {
      return 'Ikke angivet';
    }
    if (value === 'No') return 'Nej';
    if (value === 'Yes') return 'Ja';
    if (value === 'Standard') return 'Standard';
    if (value === 'NONE') return 'NONE';
    if (value === 'INGEN') return 'INGEN';
    if (value === false) return 'Nej';
    if (value === true) return 'Ja';
    return value;
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
    .container { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    
    .header img { width: 100%; max-width: 400px; border-radius: 8px; margin-bottom: 10px; }
    .content { padding: 25px; }
    h1, h2, h3 { color: #111827; }
    p { margin: 6px 0; }
    .section { margin: 25px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; }
    .total { background: #d1fae5; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold; }
    .label { font-weight: bold; color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    td { padding: 6px 0; vertical-align: top; }
    .category { background: #f3f4f6; font-weight: bold; padding: 8px; border-radius: 5px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: #fff; color: #111; text-align: center; padding: 0; border-bottom: 1px solid #e5e7eb;">
  <img src="https://elipsestudio.com/studentlife/studentlifeemail.jpg" 
       alt="Studentlife caps" 
       style="width: 100%; max-width: 700px; display: block; margin: 0 auto; border-radius: 0;">
  
 <div style="background: #f9fafb; padding: 15px 0; border-top: 1px solid #e5e7eb; text-align: center;">
  <span style="font-size: 16px; font-weight: bold; color: #111827; display: inline-block; margin: 0 10px;">
    ✓ Premium kvalitet
  </span>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style="font-size: 16px; font-weight: bold; color: #111827; display: inline-block; margin: 0 10px;">
    ✓ Personligt design
  </span>
</div>
</div>

    <div class="content">
      <p>Kære <strong>${customerDetails.firstName} ${customerDetails.lastName}</strong>,</p>
      <p>Tak for din bestilling hos Studentlife.</p>
      <p>Din bestilling med ordrenummer <strong>${orderNumber}</strong> er nu betalt.</p>

      <p><strong>Bemærk:</strong> Husk at tjekke, at alle detaljer er korrekte, herunder leveringstid (3 måneder fra bestilling, medmindre det er ekspres), skolens logo samt skolebroderi.</p>
      <p>Vi håber, at du kommer til at elske din studenterhue.</p>

      <div class="section">
        <h2>Din ordre oplysninger</h2>
        <p><span class="label">Ordren er oprettet:</span> ${new Date(orderDate).toLocaleString('da-DK')}</p>
        <p><span class="label">Ordrenummer:</span> ${orderNumber}</p>
      </div>

      <div class="section">
        <h2>Betalingsinformation</h2>
        <p><span class="label">Navn:</span> ${customerDetails.firstName} ${customerDetails.lastName}</p>
        <p><span class="label">Adresse:</span> ${customerDetails.address}</p>
        <p><span class="label">Post & By:</span> ${customerDetails.postalCode} ${customerDetails.city}</p>
      </div>

      <div class="section">
        <h2>Leveringsinformation</h2>
        <p><span class="label">Navn:</span> ${customerDetails.firstName} ${customerDetails.lastName}</p>
        <p><span class="label">Adresse:</span> ${customerDetails.address}</p>
        <p><span class="label">Post & By:</span> ${customerDetails.postalCode} ${customerDetails.city}</p>
        ${customerDetails.notes ? `<p><span class="label">Leveringsnote:</span> ${customerDetails.notes}</p>` : ''}
      </div>

      <div class="section">
        <h2>Ordre detaljer</h2>
        <p><strong>${program|| 'Hue Pakke'}</strong></p>
        <p>${totalPrice || ''} DKK</p>

        <div class="category">Information om huen</div>
        ${Object.entries(selectedOptions)
          .map(([category, options]) => {
            const hasOptions = Object.values(options).some(val =>
              val && val !== '' && val !== null && val !== false &&
              !(typeof val === 'object' && Object.keys(val).length === 0)
            );
            if (!hasOptions) return '';
            return `
              <div class="category">${formatLabel(category)}</div>
              <table>
                ${formatOptions(options)}
              </table>
            `;
          })
          .join('')}
      </div>

      <div class="total">
        <p>Total: <strong>${totalPrice} ${currency}</strong></p>
        <p>Inklusiv moms</p>
        <p>LEVERING: 0 DKK</p>
        <p>MOMS: 20% af totalbeløbet</p>
      </div>

      <div class="section" style="text-align:center;">
        <p>Tak for din ordre ❤️</p>
        <p>Vi behandler den snarest og kontakter dig, hvis vi har brug for yderligere oplysninger.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // Enhanced text version formatting
  const text = `
PREMIUM KVALITET & PERSONLIGT DESIGN
=====================================

Kære ${customerDetails.firstName} ${customerDetails.lastName},

Tak for din bestilling hos Studentlife.

Din bestilling med ordrenummer: ${orderNumber} er nu betalt.
Husk at tjekke, at alle detaljer er korrekte, herunder leveringstid (3 måneder fra bestilling, medmindre det er ekspres), skolens logo samt skolebroderi.

Vi håber, at du kommer til at elske din studenterhue.


ORDREOPLYSNINGER
-----------------
Ordren er oprettet: ${new Date(orderDate).toLocaleString('da-DK')}
Ordrenummer: ${orderNumber}


BETALINGSINFORMATION
---------------------
Navn: ${customerDetails.firstName} ${customerDetails.lastName}
Adresse: ${customerDetails.address}
Post & By: ${customerDetails.postalCode} ${customerDetails.city}


LEVERINGSINFORMATION
---------------------
Navn: ${customerDetails.firstName} ${customerDetails.lastName}
Adresse: ${customerDetails.address}
Post & By: ${customerDetails.postalCode} ${customerDetails.city}
${customerDetails.notes ? `Leveringsnote: ${customerDetails.notes}` : ''}


ORDRE DETALJER
---------------
${selectedOptions?.pakke?.name ? `Valgt pakke: ${selectedOptions.pakke.name}` : ''}
${selectedOptions?.pakke?.price ? `Pris: ${selectedOptions.pakke.price} DKK` : ''}

Information om huen:
--------------------
${Object.entries(selectedOptions)
  .map(([category, options]) => {
    const hasOptions = Object.values(options).some(val =>
      val && val !== '' && val !== null && val !== false &&
      !(typeof val === 'object' && Object.keys(val).length === 0)
    );
    if (!hasOptions) return '';

    const optionsText = Object.entries(options)
      .map(([key, value]) => {
        if (!value || value === '' || value === null || value === false) return '';

        if (typeof value === 'object' && value !== null) {
          if (value.name) {
            return `${formatLabel(key)}: ${formatValue(value.name)}`;
          }
          return Object.entries(value)
            .map(([subKey, subValue]) => {
              if (subValue && subValue !== '' && subValue !== null && subValue !== false) {
                return `${formatLabel(subKey)}: ${formatValue(subValue)}`;
              }
              return '';
            })
            .filter(Boolean)
            .join('\n');
        }
        return `${formatLabel(key)}: ${formatValue(value)}`;
      })
      .filter(Boolean)
      .join('\n');

    return `${formatLabel(category).toUpperCase()}\n${optionsText}\n`;
  })
  .filter(Boolean)
  .join('\n')}


TOTAL
------
Total: ${totalPrice} ${currency}
Inklusiv moms
LEVERING: 0 DKK
MOMS: 20% af totalbeløbet


Tak for din ordre ❤️
Vi behandler den snarest og kontakter dig, hvis vi har brug for yderligere oplysninger.
`;


  return {
    subject: `Tak for din bestilling hos Studentlife`,
    html,
    text
  };
};
const capOrderAdminEmail = (orderData) => {
  const {
    customerDetails,
    selectedOptions,
    totalPrice,
    currency,
    orderNumber,
    orderDate,
    email
  } = orderData;

  // Enhanced formatOptions for admin email
  const formatOptions = (options) => {
    return Object.entries(options)
      .map(([key, value]) => {
        if (!value || value === '' || value === null || value === false) {
          return '';
        }

        if (typeof value === 'object' && value !== null) {
          if (value.name) {
            return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(key)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(value.name)}</td></tr>`;
          }
          return Object.entries(value)
            .map(([subKey, subValue]) => {
              if (subValue && subValue !== '' && subValue !== null && subValue !== false) {
                return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(subKey)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(subValue)}</td></tr>`;
              }
              return '';
            })
            .join('');
        }

        return `<tr><td style="padding: 4px 8px; border-bottom: 1px solid #eee;">${formatLabel(key)}:</td><td style="padding: 4px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${formatValue(value)}</td></tr>`;
      })
      .join('');
  };

  const formatLabel = (label) => {
    const labelMap = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'email': 'Email',
      'phone': 'Phone',
      'Skolenavn': 'School Name',
      'address': 'Address',
      'city': 'City',
      'postalCode': 'Postal Code',
      'country': 'Country',
      'notes': 'Notes',
      'deliverToSchool': 'Deliver to School',
      'KOKARDE': 'KOKARDE',
      'Roset farve': 'Roset farve',
      'Kokarde': 'Kokarde',
      'Emblem': 'Emblem',
      'Type': 'Type',
      'TILBEHØR': 'TILBEHØR',
      'Hueæske': 'Hueæske',
      'Premium æske': 'Premium æske',
      'Huekuglepen': 'Huekuglepen',
      'Silkepude': 'Silkepude',
      'Ekstra korkarde': 'Ekstra korkarde',
      'Ekstra korkarde Text': 'Ekstra korkarde tekst',
      'Handsker': 'Handsker',
      'Stor kuglepen': 'Stor kuglepen',
      'Store kuglepen': 'Store kuglepen',
      'Smart Tag': 'Smart Tag',
      'Lyskugle': 'Lyskugle',
      'Luksus champagneglas': 'Luksus champagneglas',
      'Fløjte': 'Fløjte',
      'Trompet': 'Trompet',
      'Bucketpins': 'Bucketpins',
      'STØRRELSE': 'STØRRELSE',
      'Vælg størrelse': 'Vælg størrelse',
      'Millimeter tilpasningssæt': 'Millimeter tilpasningssæt',
      'UDDANNELSESBÅND': 'UDDANNELSESBÅND',
      'Huebånd': 'Huebånd',
      'Materiale': 'Materiale',
      'Hagerem': 'Hagerem',
      'Hagerem Materiale': 'Hagerem Materiale',
      'Broderi farve': 'Broderi farve',
      'Knap farve': 'Knap farve',
      'år': 'år',
      'BRODERI': 'BRODERI',
      'Broderifarve': 'Broderifarve',
      'Skolebroderi farve': 'Skolebroderi farve',
      'Ingen': 'Ingen',
      'BETRÆK': 'BETRÆK',
      'Farve': 'Farve',
      'Topkant': 'Topkant',
      'Kantbånd': 'Kantbånd',
      'Stjerner': 'Stjerner',
      'SKYGGE': 'SKYGGE',
      'Skyggebånd': 'Skyggebånd',
      'FOER': 'FOER',
      'Svederem': 'Svederem',
      'Sløjfe': 'Sløjfe',
      'Foer': 'Foer',
      'SatinType': 'Satin Type',
      'SilkeType': 'Silke Type',
      'EKSTRABETRÆK': 'EKSTRABETRÆK',
      'Tilvælg': 'Tilvælg'
    };
    return labelMap[label] || label;
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.name) return value.name;
      if (value.value) return value.value;
      return JSON.stringify(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === '') {
      return 'Not specified';
    }
    if (value === 'No') return 'No';
    if (value === 'Yes') return 'Yes';
    if (value === 'Standard') return 'Standard';
    if (value === 'NONE') return 'NONE';
    if (value === 'INGEN') return 'INGEN';
    if (value === false) return 'No';
    if (value === true) return 'Yes';
    return value;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 10px 10px; }
        .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
        .total { background: #dbeafe; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        .category-header { background: #f3f4f6; padding: 8px 12px; margin: 15px 0 8px 0; border-radius: 4px; font-weight: bold; }
        .alert { background: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b; margin-bottom: 15px; }
        .priority { background: #fee2e2; padding: 10px; border-radius: 5px; border-left: 4px solid #ef4444; margin-bottom: 15px; }
        .payment-pending {
          background: #ddffcdff;
          padding: 12px;
          border-radius: 6px;
          border-left: 4px solid #30ff07ff;
          margin-bottom: 15px;
          color: #088504ff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎩 NEW GRADUATION CAP ORDER RECEIVED</h1>
          <p>Order Number: ${orderNumber} | ${new Date(orderDate).toLocaleDateString('en-US')}</p>
        </div>
        
        <div class="content">
          <div class="priority">
            <strong>🚨 ACTION REQUIRED:</strong> New order received and needs to be processed.
          </div>
          <div class="payment-pending">
            <strong>✅ PAYMENT COMPLETED:</strong> Order has been received.
          </div>
          
          <div class="alert">
            <strong>📧 Customer Email:</strong> ${customerDetails.email}
          </div>

          <div class="section">
            <h2>👤 Customer Information</h2>
            <p><strong>Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</p>
            <p><strong>Email:</strong> ${customerDetails.email}</p>
            <p><strong>Phone:</strong> ${customerDetails.phone}</p>
            ${customerDetails.Skolenavn ? `<p><strong>School Name:</strong> ${customerDetails.Skolenavn}</p>` : ''}
            <p><strong>Address:</strong> ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.postalCode}, ${customerDetails.country}</p>
            ${customerDetails.notes ? `<p><strong>Customer Notes:</strong> ${customerDetails.notes}</p>` : ''}
            ${customerDetails.deliverToSchool ? `<p><strong>Deliver to School:</strong> Yes</p>` : ''}
          </div>

          <div class="section">
            <h2>⚙️ Cap Configuration</h2>
            ${Object.entries(selectedOptions)
      .map(([category, options]) => {
        const hasOptions = Object.values(options).some(val => 
          val && val !== '' && val !== null && val !== false && 
          !(typeof val === 'object' && Object.keys(val).length === 0)
        );
        if (!hasOptions) return '';

        return `
                  <div class="category-header">${formatLabel(category)}</div>
                  <table>
                    ${formatOptions(options)}
                  </table>
                `;
      })
      .join('')}
          </div>

          <div class="total">
            <h2>💰 Total Amount</h2>
            <p style="font-size: 24px; margin: 0;">${totalPrice} ${currency}</p>
          </div>

          <div class="section">
            <p><strong>📅 Order Date:</strong> ${new Date(orderDate).toLocaleString('en-US')}</p>
            <p><strong>🔢 Order Number:</strong> ${orderNumber}</p>
            <p><strong>📧 Customer Contact:</strong> ${customerDetails.email}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    NEW GRADUATION CAP ORDER NOTIFICATION - ACTION REQUIRED
    ======================================================

    Order Number: ${orderNumber}
    Order Date: ${new Date(orderDate).toLocaleString('en-US')}
    Customer Email: ${email}

    🚨 ACTION REQUIRED: New order received and needs to be processed.

    CUSTOMER INFORMATION:
    ---------------------
    Name: ${customerDetails.firstName} ${customerDetails.lastName}
    Email: ${customerDetails.email}
    Phone: ${customerDetails.phone}
    ${customerDetails.Skolenavn ? `School Name: ${customerDetails.Skolenavn}` : ''}
    Address: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.postalCode}, ${customerDetails.country}
    ${customerDetails.notes ? `Customer Notes: ${customerDetails.notes}` : ''}
    ${customerDetails.deliverToSchool ? `Deliver to School: Yes` : ''}

    CAP CONFIGURATION:
    ------------------
    ${Object.entries(selectedOptions)
      .map(([category, options]) => {
        const hasOptions = Object.values(options).some(val => 
          val && val !== '' && val !== null && val !== false && 
          !(typeof val === 'object' && Object.keys(val).length === 0)
        );
        if (!hasOptions) return '';

        const optionsText = Object.entries(options)
          .map(([key, value]) => {
            if (!value || value === '' || value === null || value === false) return '';

            if (typeof value === 'object' && value !== null) {
              if (value.name) {
                return `${formatLabel(key)}: ${formatValue(value.name)}`;
              }
              return Object.entries(value)
                .map(([subKey, subValue]) => {
                  if (subValue && subValue !== '' && subValue !== null && subValue !== false) {
                    return `${formatLabel(subKey)}: ${formatValue(subValue)}`;
                  }
                  return '';
                })
                .filter(Boolean)
                .join('\n');
            }
            return `${formatLabel(key)}: ${formatValue(value)}`;
          })
          .filter(Boolean)
          .join('\n');

        return `${formatLabel(category).toUpperCase()}\n${optionsText}\n`;
      })
      .filter(Boolean)
      .join('\n')}

    TOTAL AMOUNT:
    -------------
    ${totalPrice} ${currency}

    ACTION REQUIRED: Please process this order as soon as possible.
    Customer Contact: ${customerDetails.email}
  `;

  return {
    subject: `🎩 NEW ORDER: Graduation Cap Order : ${orderNumber} - ${customerDetails.firstName} ${customerDetails.lastName}`,
    html,
    text
  };
};

const sendCapEmail = async (req, res) => {
  try {
    const {
      customerDetails,
      selectedOptions,
      totalPrice,
      currency,
      orderNumber,
      orderDate,
      email,
      program
    } = req.body;

    // Validate required fields
    if (!customerDetails || !selectedOptions || !email) {
      return res.status(400).json({
        message: 'Missing required fields: customerDetails, selectedOptions, and email are required'
      });
    }

    const transporter = createEmailTransporter();
    const emailContent = capOrderEmail({
      customerDetails,
      selectedOptions,
      totalPrice: totalPrice || '299.00',
      currency: currency || 'DKK',
      orderNumber: orderNumber || `CAP-${Date.now()}`,
      orderDate: orderDate || new Date().toISOString(),
      program:program
    });
    const emailContentAdmin = capOrderAdminEmail({
      customerDetails,
      selectedOptions,
      totalPrice: totalPrice || '299.00',
      currency: currency || 'DKK',
      orderNumber: orderNumber || `CAP-${Date.now()}`,
      orderDate: orderDate || new Date().toISOString()
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const mailOptionsAdmin = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: "salg@studentlife.dk",
      subject: emailContentAdmin.subject,
      html: emailContentAdmin.html,
      text: emailContentAdmin.text
    };
    // Send email
    const emailResult = await transporter.sendMail(mailOptions);
    const emailResultAdmin = await transporter.sendMail(mailOptionsAdmin);

    // Optionally save to database using Prisma
    try {
      const orderData = {
        customerDetails,
        selectedOptions,
        totalPrice: parseFloat(totalPrice) || 299.00,
        currency: currency || 'DKK',
        orderNumber: orderNumber || `CAP-${Date.now()}`,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        customerEmail: email,
        status: 'PENDING'
      };

      // const result = await prisma.order.create({
      //   data: orderData
      // });

      res.status(200).json({
        message: 'Order created and email sent successfully',
        // orderId: result.id,
        // orderNumber: result.orderNumber,
        emailResult: {
          messageId: emailResult.messageId,
          accepted: emailResult.accepted
        }
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      // Still return success for email even if DB fails
      res.status(200).json({
        message: 'Email sent successfully but database save failed',
        emailResult: {
          messageId: emailResult.messageId,
          accepted: emailResult.accepted
        },
        warning: 'Order not saved to database'
      });
    }

  } catch (error) {
    console.error('Send Cap Email Error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

const stripePayment = async (req, res) => {
  const { 
    customerDetails,
      selectedOptions,
      totalPrice,
      currency,
      orderNumber,
      orderDate,
      email } = req.body;

  try {
   const order = await prisma.order.create({
  data: {
    customerDetails,
    selectedOptions,
    totalPrice:parseFloat(totalPrice),
    currency,
    orderNumber,
    orderDate,
    customerEmail: email,
    status: 'PENDING'
  }
});

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  customer_email: email,
  line_items: [
    {
      price_data: {
        currency: "dkk",
        product_data: {
          name: `Cap Order : ${order.orderNumber}`,
        },
        unit_amount: totalPrice * 100,
      },
      quantity: 1,
    },
  ],
  mode: "payment",
  locale: "da",
  success_url: `http://localhost:5173/studentlife/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: "http://localhost:5173/studentlife/cancel",
  metadata: {
    orderId: order.id,   // 👈 only store a small reference here
  },
});
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getSessionDetails = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Get the orderId from metadata
      const orderId = session.metadata.orderId;

     

      // Send emails
      const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });

await sendCapEmail(
  {
    body: {
      customerDetails: order.customerDetails,
      selectedOptions: order.selectedOptions,
      totalPrice: order.totalPrice,
      currency: order.currency,
      orderNumber: order.orderNumber,
      orderDate: order.orderDate,
      email: order.customerEmail
    }
  },
  { status: () => ({ json: () => {} }) }
);

    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


module.exports = {
  workflowStatusChange, sendCapEmail, stripePayment, getSessionDetails,stripeWebhook
};
