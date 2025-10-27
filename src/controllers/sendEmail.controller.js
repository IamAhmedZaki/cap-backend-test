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


const factoryOrderEmail = (orderData) => {
  let kokardeValue = '';
  let colorOfCapSection = '';
  let broderiSection = '';
  let betraekSection = '';
  let skyggeSection = '';
  let foerSection = '';
  let ekstraSection = '';
  let tilbehorSection = '';
  let storrelseSection = '';
  const {
    customerDetails,
    selectedOptions,
    totalPrice,
    currency,
    orderNumber,
    orderDate,
    packageName,
    program

  } = orderData;


   const hideSelectorsPrograms = [
        'sosuassistent',
        'sosuhjælper',
        'frisør',
        'kosmetolog',
        'pædagog',
        'pau',
        'ernæringsassisten'
    ];

    const shouldHideSelectors = hideSelectorsPrograms.includes(program?.toLowerCase());

  const formatLabel = (label) => {
    const labelMap = {
      // General Cap Options
      // 'Farve': 'Color',
      // 'Materiale': 'Material',
      // 'Hagerem': 'Chinstrap',
      // 'Hagerem Materiale': 'Chinstrap Material',
      // 'Broderi farve': 'Embroidery color',
      // 'Knap farve': 'Button color',
      // 'år': 'Year',
      // 'Huebånd': 'Flag ribbon',
      // 'Topkant': 'Top edging',
      // 'Kantbånd': 'Edge band',
      // 'Stjerner': 'Stars',
      // 'Skyggebånd': 'Shadow band',
      // 'Svederem': 'Sweatband',
      // 'Foer': 'Inside color',
      // 'Sløjfe': 'Bow',
      // 'Ekstrabetræk': 'Extra cover',
      // 'Hueæske': 'Cap box',
      // 'Silkepude': 'Silk cushion',
      // 'Lyskugle': 'Light ball',
      // 'Smart Tag': 'Smart Tag',
      // 'Handsker': 'Gloves',
      // 'Skolebroderi farve': 'School embroidery color',
      // 'Broderi': 'Embroidery',
      // 'BETRÆK': 'Cover',
      // 'SKYGGE': 'Brim',
      // 'FOER': 'Inside of the cap',
      // 'EKSTRABETRÆK': 'Extra cover',
      // 'TILBEHØR': 'Accessories',
      // 'STØRRELSE': 'Size',

      // // HHX - KOKARDE Section
      // 'KOKARDE': 'KOKARDE',
      // 'Emblem': 'Emblem',
      // 'Kokarde': 'Kokarde type',
      // 'Roset farve': 'Rosette color',
      // 'Type': 'Type',

      // // HHX - UDDANNELSESBÅND Section
      // 'UDDANNELSESBÅND': 'UDDANNELSESBÅND',
      // 'Broderi foran': 'Front embroidery',
      // 'Broderi farve foran': 'Front embroidery color',
      // 'Hagerem Materiale': 'Chinstrap Material',
      // 'Hagerem Type': 'Chinstrap Type',
      // 'Broderi farve bagpå': 'Back embroidery color',


      // // HHX - BRODERI Section
      // 'Broderifarve': 'Embroidery color',
      // 'Ingen': 'None',
      // 'Navne broderi': 'Name embroidery',
      // 'Skolebroderi': 'School embroidery',

      // // HHX - BETRÆK Section
      // 'BETRÆK Farve': 'Cover color',

      // // HHX - SKYGGE Section
      // 'Skygge': 'Brim',
      // 'Skyggegravering Line 1': 'Brim engraving line 1',
      // 'Skyggegravering Line 2': 'Brim engraving line 2',
      // 'Skyggegravering Line 3': 'Brim engraving line 3',
      // 'Skyggegravering': 'Brim engraving',
      // 'Linje 1': 'Line 1',
      // 'Linje 2': 'Line 2',
      // 'Linje 3': 'Line 3',

      // // HHX - FOER Section
      // 'SatinType': 'Satin type',
      // 'SilkeType': 'Silk type',

      // // HHX - EKSTRABETRÆK Section
      // 'Tilvælg': 'Optional',

      // // HHX - TILBEHØR Section
      // 'Bucketpins': 'Bucket pins',
      // 'Ekstra korkarde': 'Extra korkarde  ',
      // 'Ekstra korkarde Text': 'Extra korkarde text',
      // 'Fløjte': 'Whistle',
      // 'Huekuglepen': 'Cap pen',
      // 'Luksus champagneglas': 'Luxury champagne glass',
      // 'Premium æske': 'Premium box',
      // 'Store kuglepen': 'Large pen',
      // 'Trompet': 'Trumpet',

      // // HHX - STØRRELSE Section
      // 'Millimeter tilpasningssæt': 'Millimeter adjustment set',
      // 'Vælg størrelse': 'Foam to adjust the size'
      KOKARDE: "KOKARDE",
      Emblem: "Emblem",
      Kokarde: "Kokarde",
      "Roset farve": "Rosette color",
      Type: "Type",

      UDDANNELSESBÅND: "Education band",
      "Broderi farve": "Embroidery color",
      "Broderi foran": "Front embroidery",
      Hagerem: "Chin strap",
      "Hagerem Materiale": "Chin strap material",
      Huebånd: "Cap band",
      "Knap farve": "Button color",
      Materiale: "Material",
      år: "Year",

      BRODERI: "Embroidery",
      Broderifarve: "Embroidery color",
      Ingen: "None",
      "Navne broderi": "Name embroidery",
      Skolebroderi: "School embroidery",
      "Skolebroderi farve": "School embroidery color",

      BETRÆK: "Cover",
      Farve: "Color",
      Kantbånd: "Edge band",
      Stjerner: "Stars",
      Topkant: "Top edge",

      SKYGGE: "Brim",
      Materiale: "Material",
      Skyggebånd: "Brim band",
      "Skyggegravering Line 1": "Brim engraving line 1",
      "Skyggegravering Line 2": "Brim engraving line 2",
      "Skyggegravering Line 3": "Brim engraving line 3",
      Type: "Type",

      FOER: "Inside of the cap",
      Farve: "Color",
      Foer: "Inner band",
      Sløjfe: "Bow",
      Svederem: "Sweatband",

      EKSTRABETRÆK: "Extra cover",
      Tilvælg: "Optional",

      TILBEHØR: "Accessories",
      Bucketpins: "Bucket pins",
      "Ekstra korkarde": "Extra Kokarde",
      "Ekstra korkarde Text": "Extra Kokarde text",
      Fløjte: "Whistle",
      Handsker: "Gloves",
      Huekuglepen: "Cap pen",
      Hueæske: "Cap box",
      "Luksus champagneglas": "Luxury champagne glass",
      Lyskugle: "Light ball",
      "Premium æske": "Premium box",
      Silkepude: "Silk pillow",
      "Smart Tag": "Smart tag",
      "Store kuglepen": "Large pen",
      Trompet: "Trumpet",

      STØRRELSE: "Size",
      "Millimeter tilpasningssæt": "Millimeter fitting set",
      "Vælg størrelse": "Choosen size ",

      STX: 'bordaux',
      HTX: 'Navy Blue',
      HHX: ' Royal Blue',
      HF: 'Light Blue',
      EUX: 'Grey',
      EUD: 'Purple',
      Sosuassistent: 'Purple',
      Sosuhjælper: 'Light purple',
      Frisør: 'Light pink',
      Kosmetolog: 'Pink',
      Pædagog: 'Dark purple',
      PAU: 'Orange',
      Ernæringsassisten: 'Yellow',


    }

    return labelMap[label] || label;
  };

  const programColorMap = {
    STX: 'Bordeaux',
    HTX: 'Navy Blue',
    HHX: 'Royal Blue',
    HF: 'Light Blue',
    EUX: 'Grey',
    EUD: 'Purple',
    sosuassistent: 'Purple',
    sosuhjælper: 'Light Purple',
    frisør: 'Light Pink',
    kosmetolog: 'Pink',
    pædagog: 'Dark Purple',
    pau: 'Orange',
    ernæringsassistent: 'Yellow'
  };
  const programColor = programColorMap[program] || program;
  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.name) return value.name;
      if (value.value) return value.value;
      return JSON.stringify(value);
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === '') return 'Ikke angivet / Ikke valgt';
    return value;
  };

  const formatOptions = (options) => {
    return Object.entries(options)
      .map(([key, value]) => {
        if (!value || value === '' || value === null || value === false) return '';

        if (typeof value === 'object' && value !== null) {
          if (value.name) {
            return `<tr><td style="padding: 4px 8px;">${formatLabel(key)}:</td><td style="font-weight: bold;">${formatValue(value.name)}</td></tr>`;
          }
          return Object.entries(value)
            .map(([subKey, subValue]) => {
              if (subValue && subValue !== '' && subValue !== null && subValue !== false) {
                return `<tr><td style="padding: 4px 8px;">${formatLabel(subKey)}:</td><td style="font-weight: bold;">${formatValue(subValue)}</td></tr>`;
              }
              return '';
            })
            .join('');
        }

        return `<tr><td style="padding: 4px 8px;">${formatLabel(key)}:</td><td style="font-weight: bold;">${formatValue(value)}</td></tr>`;
      })
      .join('');
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Two Tables Side by Side</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif;">

    <div class="wrapper" style="width: 732px; overflow-x: hidden; background-color: #e7e7e7b9; margin: 0 auto;">
    <div class="infoBlock" style="margin-left: 42px; font-weight: bold; font-size: 18px;">
    <div class="downgap" style="margin-bottom: 10px;">Kunde ordre oplysninger:</div>
  <div class="downgap" style="margin-bottom: 10px;">Ordren er oprettet: </div>
  <div><div class="downgap" style="margin-bottom: 10px;">Order nr:${orderNumber}</div> <div class="downgap" style="margin-bottom: 10px;">Navn på kunde:${customerDetails.firstName} ${customerDetails.lastName}</div> <div class="downgap" style="margin-bottom: 10px;">
        Skole:${customerDetails.Skolenavn}</div></div>
 <div class="table-container23" style="display: inline-block; vertical-align: top; background:#e7e7e7b9;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
       
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Ordre detalje</td></tr>
        <tr class="gap"></tr>

      </table>
    </div>

    <div class="table-container23" style="display: inline-block; vertical-align: top; background:#e7e7e7b9;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
       
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">${packageName}</td></tr>
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Pris: ${totalPrice} DKK</td></tr>
        <tr class="gap" style="height: 20px;"></tr>

      </table>
    </div>
  <!-- First row of tables -->
  <div style="text-align:center;">
    <div class="table-container" style="display: inline-block; vertical-align: top;">
      <table style="border-collapse: collapse; width: 328px; margin: 0 auto;">
       
      </table>
    </div>

    <div class="table-container" style="display: inline-block; vertical-align: top;">
      <table style="border-collapse: collapse; width: 328px; margin: 0 auto;">
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">The cap</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Color of the cap</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${programColor}</td></tr>
        
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Material</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Materiale}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Chinstrap</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Hagerem}</td></tr>
        
       

      </table>
    </div>
  </div>

  <!-- Second row (another set of side-by-side tables) -->
  <div style="text-align:center; margin-top:40px;">
    <div class="table-container" style="display: inline-block; vertical-align: top;">
      <table style="border-collapse: collapse; width: 328px; margin: 0 auto;">
        <!-- Embroidery on frontside -->
        
        ${!selectedOptions.UDDANNELSESBÅND["Broderi foran"]?
          `
          `:`
          <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Embroidery on frontside</th></tr>
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Tekst maks. 20 tegn</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi foran"]}</td></tr>

<tr class="gap" style="height: 23px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi farve"]}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
          `}
        
       


        
         
        <!-- Embroidery on the backside of the cap -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;"> Embroidery on the backside of the cap</th></tr>
        
        
       ${!selectedOptions.BRODERI || !selectedOptions.BRODERI["Navne broderi"] ? `
        ` :
      `
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Name embroidery (Tekst) maks. 26</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI["Navne broderi"]}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.Broderifarve || 'Not chosen'}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>`}
       
       
       
        ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi ? `` : `
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">School embroidery (Tekst) maks. 35</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.['Skolebroderi farve'] || 'Not chosen'}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>`}
       
        
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Buttons color</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND['Knap farve']}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Year</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.år}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        
        <!-- brim -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Brim</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Type</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Type}</td></tr> 
        <tr class="gap" style="height: 23px;"></tr>
        ${selectedOptions.SKYGGE.Type==='Glimmer'?`
       `:`
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Material </td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Materiale}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>`
        
        }
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Shadow band</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Skyggebånd}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
       <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 1</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 1"] 
      ? 'Ikke valgt'
      : selectedOptions.SKYGGE["Skyggegravering Line 1"]
    }</td></tr>
<tr class="gap" style="height: 23px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 3</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 3"] 
      ? 'Ikke valgt'
      : selectedOptions.SKYGGE["Skyggegravering Line 3"]
    }</td></tr>
<tr class="gap" style="height: 23px;"></tr>

       
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
       
        

        <!-- Extra Cover -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Extra Cover</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Option</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr> 
        <tr class="gap" style="height: 23px;"></tr>
        
          ${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja'
      ? `
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Color</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Farve}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Top edging</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Topkant}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        ${!shouldHideSelectors?`
          
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Edge ribbon</td></tr>
          <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Kantbånd}</td></tr>
          <tr class="gap" style="height: 23px;"></tr>
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flag ribbon</td></tr>
          <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.EKSTRABETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.EKSTRABETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.EKSTRABETRÆK.Flagbånd}</td></tr>
          <tr class="gap" style="height: 23px;"></tr>
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stars (Color matches the emblem)</td></tr>
          <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
          <tr class="gap" style="height: 23px;"></tr>
          `:``}
          ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi  ?``:`
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Skolebroderi  </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Broderiets farve</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI['Skolebroderi farve']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`
}`
      : ''
    }

        
        
        
        
        <!-- Size -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Size</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Choosen size (Size)</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Vælg størrelse"]}</td></tr> 
        <tr class="gap" style="height: 23px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Foam to adjust the size</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Millimeter tilpasningssæt"] === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        
       

        
      </table>
    </div>

    <div class="table-container" style="display: inline-block; vertical-align: top;">
      <table style="border-collapse: collapse; width: 328px; margin: 0 auto;">
        <!-- Cover -->
       <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Betræk </th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Farve}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
       <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Topkant</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Topkant === 'NONE' || selectedOptions.BETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Topkant}</td></tr>
<tr class="gap" style="height: 23px;"></tr>
${!shouldHideSelectors?`
  
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kantbånd</td></tr>
  <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Kantbånd === 'NONE' || selectedOptions.BETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Kantbånd}</td></tr>
  <tr class="gap" style="height: 23px;"></tr>
  
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner</td></tr>
  <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Stjerner === 'NONE' || selectedOptions.BETRÆK.Stjerner === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Stjerner}</td></tr>
  
          <tr class="gap" style="height: 23px;"></tr>
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner farve</td></tr>
          <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
          <tr class="gap" style="height: 23px;"></tr>
          <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flagbånd</td></tr>
          <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.BETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.BETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.BETRÆK.Flagbånd}</td></tr>
          <tr class="gap" style="height: 23px;"></tr>
  `:``}
        
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        <tr class="gap" style="height: 23px;"></tr>
        
        <!-- Inside of the cap -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Inside of the cap </th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Sweatband </td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Svederem}</td></tr>
        
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Color</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Farve}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Bow</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Sløjfe}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
        
       

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 2</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 2"] 
      ? 'Ikke valgt'
      : selectedOptions.SKYGGE["Skyggegravering Line 2"]
        }</td></tr>
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Inner band</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Foer}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
       ${!selectedOptions.FOER || !selectedOptions.FOER['Satin Type']  ?``:`
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Satin Type'] ? 'Ikke valgt' : selectedOptions.FOER['Satin Type']}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>`
        }

${!selectedOptions.FOER || !selectedOptions.FOER['Silk Type']  ?``:`
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Silk Type'] ? 'Ikke valgt' : selectedOptions.FOER['Silk Type']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`
}
        
        <tr style='height:26px;'></tr>
        
        <!-- Tilbehør -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Tilbehør</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Silk cushion</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.TILBEHØR.Silkepude === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr>
        
        <tr class="gap" style="height: 23px;"></tr>

        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Small flag</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.TILBEHØR['Lille Flag']==='Fravalgt' ? 'Fravalgt' : selectedOptions.TILBEHØR['Lille Flag Text']}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>
      
    </table>
    </div>
  </div>
  </div>

</body>
</html>
`;


  const text = `
Kunde ordre oplysninger (Customer Order Information)
====================================================

Ordren er oprettet (Order created): ${new Date(orderDate).toLocaleString('da-DK')}
Ordre #${orderNumber} — ${customerDetails.firstName} ${customerDetails.lastName}
Skole (School): ${customerDetails.Skolenavn || 'Ikke angivet / Ikke valgt'}

Ordre detaljer (Order details)
------------------------------
Pakke: ${packageName || 'Hue Pakke'}
Total pris: ${totalPrice} ${currency}

Information om huen (Information about the Cap)
-----------------------------------------------
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
                .map(([subKey, subValue]) => `${formatLabel(subKey)}: ${formatValue(subValue)}`)
                .join('\n');
            }
            return `${formatLabel(key)}: ${formatValue(value)}`;
          })
          .join('\n');

        return `${formatLabel(category).toUpperCase()}\n${optionsText}\n`;
      })
      .join('\n')}

NOTE TIL FABRIK / NOTE TO FACTORY
---------------------------------
- Kontroller broderi tekstlængde og farver.
- Check color consistency with emblem.
- Bekræft størrelse, materiale og hagerem-type.
`;

  return {
    subject: `FACTORY ORDER – #${orderNumber} (${customerDetails.firstName} ${customerDetails.lastName})`,
    html,
    text
  };
};


const capOrderEmail = (orderData) => {
  const {
    customerDetails,
    selectedOptions,
    totalPrice,
    currency,
    orderNumber,
    orderDate,
    packageName,
    program
  } = orderData;


   const hideSelectorsPrograms = [
        'sosuassistent',
        'sosuhjælper',
        'frisør',
        'kosmetolog',
        'pædagog',
        'pau',
        'ernæringsassisten'
    ];

    const shouldHideSelectors = hideSelectorsPrograms.includes(program?.toLowerCase());

  const leveringstid = new Date(orderDate);
  leveringstid.setMonth(leveringstid.getMonth() + 3);

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

  const programColorMap = {
    STX: 'Bordeaux',
    HTX: 'Navy Blue',
    HHX: 'Royal Blue',
    HF: 'Light Blue',
    EUX: 'Grey',
    EUD: 'Purple',
    sosuassistent: 'Purple',
    sosuhjælper: 'Light Purple',
    frisør: 'Light Pink',
    kosmetolog: 'Pink',
    pædagog: 'Dark Purple',
    pau: 'Orange',
    ernæringsassistent: 'Yellow'
  };
  const programColor = programColorMap[program] || program;

  const html = `

<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordrebekræftelse - Studentlife</title>
</head>
<body style="margin: 0; box-sizing: border-box; padding: 0; font-family: Arial, sans-serif; background-color: #ffff; color: #333333; line-height: 1.4;">
    <!-- Main Container -->
    <div style="text-align: center; padding: 20px 5px;">
        <img src="https://res.cloudinary.com/ds1ogapco/image/upload/v1761063050/01_q0pctl.png" alt="Studentlife" style="max-width: 100%; height: auto;">
    </div>

    <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; padding: 0 20px;">
        
        <!-- Header -->
        
        <!-- Content Area -->
        <div>
            
            <!-- Premium Quality Banner -->
            <div style="background-color: #f9fafb; padding: 15px 0; border-top: 1px solid #e5e7eb; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 16px; font-weight: bold; color: #111827; display: inline-block; margin: 0 15px;">
                    ✓ Premium kvalitet
                </span>
                <span style="font-size: 16px; font-weight: bold; color: #111827; display: inline-block; margin: 0 15px;">
                    ✓ Personligt design
                </span>
            </div>
            
            <!-- Greeting Section -->
            <div style="margin-bottom: 30px;">
                <p style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">Kære: ${customerDetails.firstName} ${customerDetails.lastName},</p>
                <p style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">Tak for din bestilling hos Studentlife.</p>
                <p style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">Din bestilling med ordre nummer: ${orderNumber} er nu betalt.</p>
                <p style="margin-bottom: 15px; font-size: 16px;">Husk at tjekke alle detaljer er korrekte, herunder også leveringstid ${leveringstid.toLocaleDateString()}, skolens logo samt skolebroderi.</p>
                <p style="margin-bottom: 15px; font-size: 16px;">Vi håber at du kommer til at elske din studenterhue.</p>
            </div>
            
            <!-- Order Information -->
            <div style="margin-bottom: 30px;">
                <div style="font-size: 21px; font-weight: bold; margin-bottom: 15px; color: #333333;">Din ordre oplysninger:</div>
                <p style="margin-bottom: 15px; font-size: 16px;">Ordren er oprettet:</p>
                <div style="background-color: #f2f3f2; padding: 15px; margin: 20px 0; font-weight: bold; font-size: 15px; text-align: center;">
                    Order nr: ${orderNumber}
                </div>
            </div>
            
            <!-- Payment & Delivery Info -->
                <!-- Payment Information -->
                <div style="background-color: #f2f3f2; padding: 30px 25px; margin-bottom: 20px">
                    <div style="font-size: 19px; font-weight: bold; margin-bottom: 15px;">Betalingsoplysninger</div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Oplysninger om betaleren</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Navn:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.firstName} ${customerDetails.lastName}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Adresse:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.address}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Postnummer og by:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.postalCode} ${customerDetails.city}</div>
                    </div>
                </div>
                
                <!-- Delivery Information -->
                <div style="background-color: #f2f3f2; padding: 30px 25px; margin-bottom: 20px;">
                    <div style="font-size: 19px; font-weight: bold; margin-bottom: 15px;">Leveringsoplysninger</div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Navn:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.firstName} ${customerDetails.lastName}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Adresse:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.address}</div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Postnummer og by:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.postalCode} ${customerDetails.city}</div>
                    </div>
                    ${customerDetails.notes ? `
                    <div style="margin-bottom: 10px;">
                        <div style="font-weight: bold; margin-bottom: 5px; font-size: 15px;">Levering:</div>
                        <div style="margin-bottom: 10px; font-size: 16px;">${customerDetails.notes}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Order Details -->
            <div style="background-color: #ffffff; padding: 30px 20px 10px 20px;">
                <div>
                    <div style="font-weight: bold; font-size: 18px;">Ordre detaljer</div>
                </div>
            </div>
            
            <div style="background-color: #fbfbfb; padding: 30px;">
                <div style="margin-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 18px;">${packageName}</div>
                </div>
                <div style="margin-bottom: 10px;">
                    <div><span style="font-weight: bold; font-size: 16px; margin-right: 5px;">Pris:</span><span style="font-size: 16px;">${totalPrice} DKK</span></div>
                </div>
            </div>
            
            <!-- Product Details Section -->
            <div style="background-color: #f2f3f2; padding: 40px 30px; margin-bottom: 30px;">
                
                <!-- Product Details Columns -->
                <div>
                    
                    <!-- Left Column -->
                    <div>
                        
                        <!-- Kokarde Section -->
                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Kokarde</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Roset farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.KOKARDE['Roset farve'].name}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Kokarde type</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.KOKARDE.Kokarde}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Emblem</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Emblem type</div>
                                  <div style="font-size: 16px;">${selectedOptions.KOKARDE.Type}</div>
                              </div>
                            </div>
                        </div>
                        
                        <!-- Front Embroidery Section -->
                        ${!selectedOptions.UDDANNELSESBÅND["Broderi foran"] ? '' : `
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Broderi foran</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Tekst maks. 20 tegn</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi foran"]}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Broderi farve</div>
                                  <div style="font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi farve"]}</div>
                              </div>
                            </div>
                        </div>
                        `}
                        
                        <!-- Back Embroidery Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Broderi Bagpå</div>
                              <div style="background-color: #f7f8f7; padding: 20px;">
                              ${!selectedOptions.BRODERI || !selectedOptions.BRODERI["Navne broderi"] ? '' : `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Name embroidery (Tekst) maks. 26</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI["Navne broderi"]}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Embroidery color</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI?.Broderifarve || 'Ikke valgt'}</div>
                              </div>
                              `}
                              
                              ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi ? '' : `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">School embroidery (Tekst) maks. 35</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Embroidery color</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI?.['Skolebroderi farve'] || 'Ikke valgt'}</div>
                              </div>
                              `}
                              
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Knap Farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND['Knap farve']}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">År</div>
                                  <div style="font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.år}</div>
                              </div>
                            </div>
                        </div>
                        
                        <!-- Brim Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Skygge</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Type</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.SKYGGE.Type}</div>
                              </div>
                              ${selectedOptions.SKYGGE.Type === 'Glimmer' ? '' : `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Material</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.SKYGGE.Materiale}</div>
                              </div>
                              `}
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Skyggebånd</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.SKYGGE.Skyggebånd}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Linje 1</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 1"] ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 1"]}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Linje 3</div>
                                  <div style="font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 3"] ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 3"]}</div>
                              </div>
                            </div>
                        </div>
                        
                        <!-- Extra Cover Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Extra Cover</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Tilvælg</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              
                              ${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja' ? `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Farve}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Topkant</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Topkant === 'NONE' || selectedOptions.EKSTRABETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Topkant}</div>
                              </div>
                              ${!shouldHideSelectors ? `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Kantbånd</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Kantbånd === 'NONE' || selectedOptions.EKSTRABETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Kantbånd}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Flagbånd</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${!selectedOptions.EKSTRABETRÆK.Flagbånd ? 'Fravalgt' : selectedOptions.EKSTRABETRÆK.Flagbånd == 'Nej' ? 'Fravalgt' : selectedOptions.EKSTRABETRÆK.Flagbånd}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Stjerner</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</div>
                              </div>
                              ` : ''}
                              ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi ? '' : `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Skolebroderi</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Broderiets farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BRODERI['Skolebroderi farve']}</div>
                              </div>
                              `}
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Lyskugle</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Lyskugle === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Luksus champagneglas</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR['Luksus champagneglas'] === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Fløjte</div>
                                  <div style="font-size: 16px;">${selectedOptions.TILBEHØR.Fløjte === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              ` : ''}
                            </div>
                        </div>
                        
                        <!-- Size Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Størrelse</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Vælg størrelse (Size)</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.STØRRELSE["Vælg størrelse"]}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Millimeter tilpasningssæt</div>
                                  <div style="font-size: 16px;">${selectedOptions.STØRRELSE["Millimeter tilpasningssæt"] === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Right Column -->
                    <div style="width: 100%;">
                        
                        <!-- Education Band Section -->
                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Uddannelsesbånd</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Huebånd</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Huebånd}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Materiale</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Materiale}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Hagerem</div>
                                  <div style="font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Hagerem}</div>
                              </div>
                            </div>
                        </div>
                        
                        <!-- Cover Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Betræk</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BETRÆK.Farve}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Topkant</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BETRÆK.Topkant === 'NONE' || selectedOptions.BETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Topkant}</div>
                              </div>
                              ${!shouldHideSelectors ? `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Kantbånd</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BETRÆK.Kantbånd === 'NONE' || selectedOptions.BETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Kantbånd}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Stjerner</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.BETRÆK.Stjerner === 'NONE' || selectedOptions.BETRÆK.Stjerner === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Stjerner}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Stjerner farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Flagbånd</div>
                                  <div style="font-size: 16px;">${!selectedOptions.BETRÆK.Flagbånd ? 'Fravalgt' : selectedOptions.BETRÆK.Flagbånd == 'Nej' ? 'Fravalgt' : selectedOptions.BETRÆK.Flagbånd}</div>
                              </div>
                              ` : ''}
                            </div>
                        </div>
                        
                        <!-- Lining Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Foer</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Svederem</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.FOER.Svederem}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Farve</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.FOER.Farve}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Sløjfe</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.FOER.Sløjfe}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Linje 2</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 2"] ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 2"]}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Forring</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.FOER.Foer}</div>
                              </div>
                              ${!selectedOptions.FOER || !selectedOptions.FOER['Satin Type'] ? '' : `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Satin Type</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${!selectedOptions.FOER['Satin Type'] ? 'Ikke valgt' : selectedOptions.FOER['Satin Type']}</div>
                              </div>
                              `}
                              ${!selectedOptions.FOER || !selectedOptions.FOER['Silk Type'] ? '' : `
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Silk Type</div>
                                  <div style="font-size: 16px;">${!selectedOptions.FOER['Silk Type'] ? 'Ikke valgt' : selectedOptions.FOER['Silk Type']}</div>
                              </div>
                              `}
                            </div>
                        </div>
                        
                        <!-- Accessories Section -->
                        <div style="margin-bottom: 25px; margin-top: 20px;">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333333;">Tilbehør</div>
                            <div style="background-color: #f7f8f7; padding: 20px;">
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Hueæske</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Hueæske}</div>
                              </div>
                              ${selectedOptions.TILBEHØR['Premium æske'] ? `
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Premium æske</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR['Premium æske']}</div>
                              </div>
                              ` : ''}
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Huekuglepen</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Huekuglepen === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Silkepude</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Silkepude === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Ekstra Kokarde</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR['Ekstra korkarde'] === 'Fravalgt' ? 'Fravalgt' : selectedOptions.TILBEHØR['Ekstra korkarde Text']}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Handsker</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Handsker === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Stor kuglepen</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR["Store kuglepen"] === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Smarttag</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR["Smart Tag"] === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Lille flag</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR['Lille Flag'] === 'Fravalgt' ? 'Fravalgt' : selectedOptions.TILBEHØR['Lille Flag Text']}</div>
                                                                                    
                              </div>
                              <div style="margin-bottom: 10px; border-bottom: 1px solid #cdcdcd;">
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Trompet</div>
                                  <div style="margin-bottom: 10px; font-size: 16px;">${selectedOptions.TILBEHØR.Trompet === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                              <div>
                                  <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Bucketpins</div>
                                  <div style="font-size: 16px;">${selectedOptions.TILBEHØR.Bucketpins === 'Ja' ? 'Ja' : 'Fravalgt'}</div>
                              </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
        
        <!-- Footer with Total -->
        <div style="background-color: #f2f3f2; padding: 20px; margin-top: 30px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Total: ${totalPrice} DKK</div>
            <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">Inklusiv moms</div>
            <hr style="border: none; border-top: 1px solid #cdcdcd; margin: 15px 0;">
            <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">SUM: ${totalPrice} DKK</div>
            <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">LEVERING: 0 DKK</div>
            <div style="margin-bottom: 5px; font-size: 14px; text-transform: uppercase;">MOMS: ${(totalPrice * 0.20).toFixed(2)} DKK</div>
        </div>
        
        <!-- Signature -->
        <div style="margin: 40px 35px; border-top: 1px solid #cdcdcd;">
            <p style="font-size: 14px;">Er du i tvivl om noget? Kundeservice altid klar, hvis du har brug for hjælp.</p>
            <p style="font-size: 14px;">Vi ønsker dig en dejlig dag,</p>
            <p style="font-size: 14px;">Studentlife 😊</p>
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
    packageName,
    program
  } = orderData;

   const hideSelectorsPrograms = [
        'sosuassistent',
        'sosuhjælper',
        'frisør',
        'kosmetolog',
        'pædagog',
        'pau',
        'ernæringsassisten'
    ];

    const shouldHideSelectors = hideSelectorsPrograms.includes(program?.toLowerCase());

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
  <meta charset="UTF-8">
  <title>Two Tables Side by Side</title>
</head>
 <style>
    body {
      font-family: Arial, sans-serif;
      /* text-align: center; */
      margin: 0;
      padding: 50px 0;
    }

    .table-container {
      display: inline-block; /* allows side-by-side placement */
      /* space between tables */
      vertical-align: top; /* align tops evenly */
    }
    .table-container3 {
      display: inline-block; /* allows side-by-side placement */
      padding-right:10px;
      vertical-align: top; /* align tops evenly */
    }
    .table-container2 {
      display: inline-block; /* allows side-by-side placement */
      /* space between tables */
      vertical-align: top; /* align tops evenly */
      background:#e7e7e7;
    }
      .table-container23 {
      display: inline-block; /* allows side-by-side placement */
      /* space between tables */
      vertical-align: top; /* align tops evenly */
      background:#ffffff;
    }


    table {
      border-collapse: collapse;
      width: 342px;
      /* border: 1px solid #ccc; */
      margin: 0 auto;
    }

    th {
      font-size: 20px;
      padding: 10px;
      text-align: left;
      /* background-color: #f2f2f2; */
    }

    td {
      padding: 9px;
      font-size: 16px;
      /* border-top: 1px solid #ddd; */
    }

    .subheading {
      font-weight: bold;
      background-color: #ffffff;
        text-align: left;
    }
    
    .subheading2 {
      font-weight: bold;
     
       text-align: left;
    }

    .value {
      font-size: 18px;
      /* color: #0074D9; */
      background-color: #ffffff;
       text-align: left;
    }

    .gap{
        height: 20px;
    }
    .infoBlock{
      position: relative;
       
        font-weight: bold;
        font-size: 18px;
        
    }
    .wrapper {
  width: 732px;
  
  background-color: #ffffff;
  margin: 0 auto; /* This centers the wrapper */
}

.downgap{
  margin-bottom: 10px;
}
.orderNumber{
    background-color: #e7e7e7;
    padding: 17px;
    width: 657px;
}
    .footer{
    background-color: #e7e7e7;
    padding: 17px;
    /* width: 657px; */
    font-weight: bold;
    font-size: 20px;
}
    .marginwala{
    margin-right:10px;
    }
    
    @media only screen and (max-width: 600px) {
        .package{
    margin-left:0px;
    }
    
      }
    
    
  </style>
<body style="margin:0; padding:0; font-family:Arial, sans-serif;">

  <div class="wrapper" style="width: 732px; background-color: #ffffff; margin: 0 auto;">
    <div class="infoBlock" style="position: relative; font-weight: bold; font-size: 18px;">
        
    <div class="downgap" style="margin-bottom: 10px;">Kunde ordre oplysninger:</div>
  <div class="gap" style="height: 20px;"></div>
    <div class="downgap" style="margin-bottom: 10px;">Ordren er oprettet: </div>
    <div class="gap" style="height: 20px;"></div>
  <div><div class="downgap orderNumber" style="margin-bottom: 10px; background-color: #e7e7e7; padding: 17px; width: 657px;">Order nr: ${orderNumber}</div></div>
 <div class="table-container2 marginwala" style="display: inline-block; vertical-align: top; background:#e7e7e7; margin-right: 10px;">
  <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
    <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Betalingsoplysninger</th></tr>
    <tr class="gap" style="height: 20px;"></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Oplysninger om betaleren</td></tr>
    <tr class="gap" style="height: 20px;"></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Navn: ${customerDetails.firstName} ${customerDetails.lastName}</td></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Adresse: ${customerDetails.address}</td></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Postnummer og by: ${customerDetails.postalCode} ${customerDetails.city}</td></tr>
    <tr class="gap" style="height: 20px;"></tr>
    <tr class="gap" style="height: 20px;"></tr>
    <tr class="gap" style="height: 20px;"></tr>
  </table>
</div>

<div class="table-container2" style="display: inline-block; vertical-align: top; background:#e7e7e7;">
  <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
    <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Leveringsoplysninger</th></tr>
    <tr class="gap" style="height: 20px;"></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Navn: ${customerDetails.firstName} ${customerDetails.lastName}</td></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Adresse: ${customerDetails.address}</td></tr>
    <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Postnummer og by: ${customerDetails.postalCode} ${customerDetails.city}</td></tr>
    <tr class="gap" style="height: 20px;"></tr>
    ${customerDetails.notes ? `<tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Levering: ${customerDetails.notes}</td></tr>` : ''}
  </table>
</div>


    <div class="gap" style="height: 20px;"></div> 
    <div class="gap" style="height: 20px;"></div> 
    <div class="gap" style="height: 20px;"></div> 
    <div class="gap" style="height: 20px;"></div> 
  
  
    <div class="table-container23" style="display: inline-block; vertical-align: top; background:#ffffff;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
       
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Ordre detalje</td></tr>
        <tr class="gap"></tr>

      </table>
    </div>

    <div class="table-container23" style="display: inline-block; vertical-align: top; background:#ffffff;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
       
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">${packageName}</td></tr>
        <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Pris: ${totalPrice} DKK</td></tr>
        <tr class="gap" style="height: 20px;"></tr>

      </table>
    </div>
  <div class="gap" style="height: 20px;"></div>
  <div class="gap" style="height: 20px;"></div>
  <div class="gap" style="height: 20px;"></div>
  </div>
  <!-- First row of tables -->
  
  <!-- kok -->
   <div style="background-color: #e7e7e7;">
     <div class="gap" style="height: 20px;"></div>
     <div class="gap" style="height: 20px;"></div>
     <div class="gap" style="height: 20px;"></div>
  

  
  <!-- Second row (another set of side-by-side tables) -->
  <div style="text-align:center; margin-top:40px;">
    <div class="table-container3" style="display: inline-block; vertical-align: top;  padding-right:10px;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
        <!-- Kokarde -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Kokarde</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Roset farve</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE['Roset farve'].name}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
       <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kokarde type</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Kokarde}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Emblem</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Emblem type</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Type}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        
       <!-- Embroidery on frontside -->

${
  !selectedOptions.UDDANNELSESBÅND["Broderi foran"] 
    ? `
     
    `
    : `
    <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Broderi foran</th></tr>
      <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Tekst maks. 20 tegn</td></tr>
      <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi foran"]}</td></tr>
      <tr class="gap" style="height: 20px;"></tr>
      <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Broderi farve</td></tr>
      <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi farve"]}</td></tr>
      <tr class="gap" style="height: 20px;"></tr>
    `
}

<!-- Embroidery on the backside of the cap -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Broderi Bagpå</th></tr>
${!selectedOptions.BRODERI || !selectedOptions.BRODERI["Navne broderi"]?`
 `:
`
 <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Name embroidery (Tekst) maks. 26</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI["Navne broderi"]}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
 <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.Broderifarve || 'Ikke valgt'}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`}

${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi  ?``:`
 <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">School embroidery (Tekst) maks. 35</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.['Skolebroderi farve'] || 'Ikke valgt'}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`}

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Knap Farve</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND['Knap farve']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">År</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.år}</td></tr>
<tr class="gap" style="height: 20px;"></tr>

        
        <!-- brim -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Skygge</th></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Type</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Type}</td></tr> 
<tr class="gap" style="height: 20px;"></tr>
${selectedOptions.SKYGGE.Type==='Glimmer'?`
       `:`
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Material </td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Materiale}</td></tr>
        <tr class="gap" style="height: 23px;"></tr>`
        
        }
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Skyggebånd</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Skyggebånd}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 1</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 1"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 1"]}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 3</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 3"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 3"]}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>

<!-- Extra Cover -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Extra Cover</th></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Tilvælg </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr> 
<tr class="gap" style="height: 20px;"></tr>

${selectedOptions.EKSTRABETRÆK.Tilvælg === 'Ja' ? `
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Farve}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Topkant</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Topkant === 'NONE' || selectedOptions.EKSTRABETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Topkant}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
${!shouldHideSelectors?`
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kantbånd</td></tr>
  <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Kantbånd === 'NONE' || selectedOptions.EKSTRABETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Kantbånd}</td></tr>
  <tr class="gap" style="height: 20px;"></tr>
 
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flagbånd</td></tr>
  <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.EKSTRABETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.EKSTRABETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.EKSTRABETRÆK.Flagbånd}</td></tr>
  <tr class="gap" style="height: 20px;"></tr>
  
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner </td></tr>
  <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
  <tr class="gap" style="height: 20px;"></tr>
 
  `:``}
${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi  ?``:`
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Skolebroderi  </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Broderiets farve</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI['Skolebroderi farve']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`
}
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Lyskugle</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Lyskugle === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Luksus champagneglas</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR['Luksus champagneglas'] === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Fløjte</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Fløjte === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>

<tr class="gap" style="height: 20px;"></tr>
` : ''}

<!-- Size -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Størrelse</th></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Vælg størrelse (Size)</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Vælg størrelse"]}</td></tr> 
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Millimeter tilpasningssæt</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Millimeter tilpasningssæt"] === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr class="gap" style="height: 20px;"></tr>
</table>
</div>

    <div class="table-container" style="display: inline-block; vertical-align: top;">
      <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
                <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Uddannelsesbånd</th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Huebånd</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Huebånd}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Materiale</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Materiale}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Hagerem</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Hagerem}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        
        <!-- Cover -->
        <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Betræk </th></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve</td></tr>
        <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Farve}</td></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Topkant</td></tr>
 <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Topkant === 'NONE' || selectedOptions.BETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Topkant}</td></tr>
 <tr class="gap" style="height: 20px;"></tr>
        ${!shouldHideSelectors?`
          
   
   <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kantbånd</td></tr>
   <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Kantbånd === 'NONE' || selectedOptions.BETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Kantbånd}</td></tr>
   <tr class="gap" style="height: 20px;"></tr>
   
   <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner</td></tr>
   <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Stjerner === 'NONE' || selectedOptions.BETRÆK.Stjerner === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Stjerner}</td></tr>
   
           <tr class="gap" style="height: 20px;"></tr>
          
           <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner farve</td></tr>
           <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
           <tr class="gap" style="height: 20px;"></tr>
           <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flagbånd</td></tr>
           <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.BETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.BETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.BETRÆK.Flagbånd}</td></tr>
           `:``}
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr class="gap" style="height: 20px;"></tr>
        <tr style="height: 10px;"></tr>
       
        
        
     <!-- Inside of the cap -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Foer </th></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Svederem</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Svederem}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve </td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Farve}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Sløjfe</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Sløjfe}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 2</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 2"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 2"]}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Forring</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Foer}</td></tr>
<tr class="gap" style="height: 20px;"></tr>
${!selectedOptions.FOER || !selectedOptions.FOER['Satin Type']  ?``:`
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Satin Type'] ? 'Ikke valgt' : selectedOptions.FOER['Satin Type']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`
}

${!selectedOptions.FOER || !selectedOptions.FOER['Silk Type']  ?``:`
<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Silk Type'] ? 'Ikke valgt' : selectedOptions.FOER['Silk Type']}</td></tr>
<tr class="gap" style="height: 20px;"></tr>`
}
 <tr style="height: 10px;"></tr>
        
        <!-- Tilbehør -->
<tr><th style="font-size: 20px; padding: 10px; text-align: left;">Tilbehør</th></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Hueæske</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Hueæske}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

${selectedOptions.TILBEHØR['Premium æske']?`
  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Premium æske</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR['Premium æske']}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>
  `:``
}


<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Huekuglepen</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Huekuglepen === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Silkepude</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Silkepude === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Ekstra Kokarde</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR['Ekstra korkarde']==='Fravalgt'  ? 'Fravalgt' : selectedOptions.TILBEHØR['Ekstra korkarde Text']}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Handsker</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Handsker === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stor kuglepen</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR["Store kuglepen"] === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Smarttag</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR["Smart Tag"] === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Lille flag</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR['Lille Flag']==='Fravalgt' ? 'Fravalgt' : selectedOptions.TILBEHØR['Lille Flag Text']}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Trompet</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Trompet === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>
<tr class="gap" style="height: 20px;"></tr>

<tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Bucketpins</td></tr>
<tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
  ${selectedOptions.TILBEHØR.Bucketpins === 'Ja' ? 'Ja' : 'Fravalgt'}
</td></tr>

<tr class="gap" style="height: 20px;"></tr>
    </table>
    </div>
  </div>
  </div>
  <div class="gap" style="height: 20px;"></div>
  <div class="gap" style="height: 20px;"></div>
  <div class="gap" style="height: 20px;"></div>
  <div class="footer" style="background-color: #e7e7e7; padding: 17px; font-weight: bold; font-size: 20px;">
    Total: ${totalPrice} DKK <br>
    <div class="gap" style="height: 20px;"></div> 
Inklusiv moms <br>
<div class="gap" style="height: 20px;"></div>
  <hr>

SUM: ${totalPrice} DKK<br>
<div class="gap" style="height: 20px;"></div>
LEVERING: 0 DKK<br>
<div class="gap" style="height: 20px;"></div>
MOMS: ${(totalPrice * 0.20).toFixed(2)} DKK<br>
<div class="gap" style="height: 20px;"></div>

  </div>

  <!-- wrapper end  -->
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
------
SUM: ${totalPrice} ${currency}
Inklusiv moms
LEVERING: 0 DKK
MOMS: 20% of the total price DKK (vat)



`;


  return {
    subject: `Tak for din bestilling hos Studentlife`,
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
      packageName,
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
      packageName: packageName,
      program: program
    });
    const emailContentAdmin = capOrderAdminEmail({
      customerDetails,
      selectedOptions,
      totalPrice: totalPrice || '299.00',
      currency: currency || 'DKK',
      orderNumber: orderNumber || `CAP-${Date.now()}`,
      orderDate: orderDate || new Date().toISOString(),
      packageName: packageName,
      program: program
    });
    const emailContentFactory = factoryOrderEmail({
      customerDetails,
      selectedOptions,
      totalPrice: totalPrice || '299.00',
      currency: currency || 'DKK',
      orderNumber: orderNumber || `CAP-${Date.now()}`,
      orderDate: orderDate || new Date().toISOString(),
      packageName: packageName,
      program: program
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
      to:  'salg@studentlife.dk',
      subject: emailContentAdmin.subject,
      html: emailContentAdmin.html,
      text: emailContentAdmin.text
    };

    const mailOptionsFactory = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to:  'salg@studentlife.dk',
      subject: emailContentFactory.subject,
      html: emailContentFactory.html,
      text: emailContentFactory.text
    };
    // Send email
    const emailResult = await transporter.sendMail(mailOptions);
    const emailResultAdmin = await transporter.sendMail(mailOptionsAdmin);
    const emailResultFactory = await transporter.sendMail(mailOptionsFactory);

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
    email,
    packageName,
    program } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        customerDetails,
        selectedOptions,
        totalPrice: parseFloat(totalPrice),
        currency,
        orderNumber,
        orderDate,
        customerEmail: email,
        status: 'PENDING',
        packageName: packageName,
        program: program
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
      success_url: `https://shop.studentlife.dk/thankyou/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://elipsestudio.com/devstudentlife/cancel",
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
            email: order.customerEmail,
            packageName: order.packageName,
            program: order.program
          }
        },
        { status: () => ({ json: () => { } }) }
      );

    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

const emailTester = async (req, res) => {
    const {
      customerDetails,
      selectedOptions,
      totalPrice,
      currency,
      orderNumber,
      orderDate,
      email,
      packageName,
      program
    } = req.body;

    

  try {
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

   



      // Send emails
     

      await sendCapEmail(
        {
          body: {
            customerDetails: customerDetails,
            selectedOptions: selectedOptions,
            totalPrice: totalPrice,
            currency: currency,
            orderNumber: orderNumber,
            orderDate: orderDate,
            email: email,
            packageName: packageName,
            program: program
          }
        },
        { status: () => ({ json: () => { } }) }
      );

    

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};


module.exports = {
  workflowStatusChange, sendCapEmail, stripePayment, getSessionDetails, stripeWebhook,emailTester
};














// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>Two Tables Side by Side</title>
// </head>

// <body style="margin:0; padding:0; font-family:Arial, sans-serif;">
//   <div class="wrapper" style="width: 732px; overflow-x: hidden; background-color: #ffffff; margin: 0 auto;">
//     <div class="infoBlock" style="position: relative; font-weight: bold; font-size: 18px;">
       
//     <div class="downgap" style="margin-bottom: 10px;">Kunde ordre oplysninger:</div>
//   <div class="gap" style="height: 20px;"></div>
//     <div class="downgap" style="margin-bottom: 10px;">Ordren er oprettet: </div>
//     <div class="gap" style="height: 20px;"></div>
//   <div><div class="downgap orderNumber" style="margin-bottom: 10px; background-color: #e7e7e7; padding: 17px; width: 657px;">Order nr: ${orderNumber}</div></div>
//   <div class="table-container2" style="display: inline-block; vertical-align: top; background:#e7e7e7;">
//       <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
//     <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Betalingsoplysninger</th></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Oplysninger om betaleren</td></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Navn: ${customerDetails.firstName} ${customerDetails.lastName}</td></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Adresse: ${customerDetails.address}</td></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Postnummer og by: ${customerDetails.postalCode} ${customerDetails.city}</td></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//   </table>
// </div>

// <div class="table-container2" style="display: inline-block; vertical-align: top; background:#e7e7e7;">
//   <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
//     <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Leveringsoplysninger</th></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Navn: ${customerDetails.firstName} ${customerDetails.lastName}</td></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Adresse: ${customerDetails.address}</td></tr>
//     <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Postnummer og by: ${customerDetails.postalCode} ${customerDetails.city}</td></tr>
//     <tr class="gap" style="height: 20px;"></tr>
//     ${customerDetails.notes ? `<tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Levering: ${customerDetails.notes}</td></tr>` : ''}
//   </table>
//     </div>

//     <div class="gap" style="height: 20px;"></div> 
//     <div class="gap" style="height: 20px;"></div> 
//     <div class="gap" style="height: 20px;"></div> 
//     <div class="gap" style="height: 20px;"></div> 
  
  
//    <div class="table-container23" style="display: inline-block; vertical-align: top; background:#ffffff;">
//       <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
       
//         <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Ordre detalje</td></tr>
//         <tr class="gap"></tr>

//       </table>
//     </div>

//     <div class="table-container23" style="display: inline-block; vertical-align: top; background:#ffffff;">
//       <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
       
//         <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">${packageName}</td></tr>
//         <tr><td class="subheading2" style="font-weight: bold; text-align: left; padding: 9px; font-size: 16px;">Pris: ${totalPrice} DKK</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>

//       </table>
//     </div>
//   <div class="gap" style="height: 20px;"></div>
//   <div class="gap" style="height: 20px;"></div>
//   <div class="gap" style="height: 20px;"></div>
//   </div>
//   <!-- First row of tables -->
  
//   <!-- kok -->
//    <div style="background-color: #e7e7e7;">
//      <div class="gap" style="height: 20px;"></div>
//      <div class="gap" style="height: 20px;"></div>
//      <div class="gap" style="height: 20px;"></div>
  

  
//   <!-- Second row (another set of side-by-side tables) -->
//   <div style="text-align:center; margin-top:40px;">
//     <div class="table-container" style="display: inline-block; vertical-align: top;">
//       <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
//         <!-- Kokarde -->
//         <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Kokarde</th></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Roset farve</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE['Roset farve'].name}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kokarde type</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Emblem</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Kokarde}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Emblem type</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Type}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
        
//        <!-- Embroidery on frontside -->
//        ${
        //  !selectedOptions.UDDANNELSESBÅND["Broderi foran"] 
//          ? `
         
//          `
//          : `
//          <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Broderi foran</th></tr>
//       <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Tekst maks. 20 tegn</td></tr>
//       <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi foran"]}</td></tr>
//       <tr class="gap" style="height: 20px;"></tr>
//       <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Broderi farve</td></tr>
//       <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND["Broderi farve"]}</td></tr>
//       <tr class="gap" style="height: 20px;"></tr>
//     `
// }

// <!-- Embroidery on the backside of the cap -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Broderi Bagpå</th></tr>
// ${!selectedOptions.BRODERI || !selectedOptions.BRODERI["Navne broderi"]?`
// `:
// `
//  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Name embroidery (Tekst) maks. 26</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI["Navne broderi"]}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
//  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.Broderifarve || 'Ikke valgt'}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>`}

// ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi  ?``:`
//  <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">School embroidery (Tekst) maks. 35</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI.Skolebroderi}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Embroidery color </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI?.['Skolebroderi farve'] || 'Ikke valgt'}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>`}

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Knap Farve</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND['Knap farve']}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">År</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.år}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>

        
//         <!-- brim -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Skygge</th></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Type</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Type}</td></tr> 
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Material </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Materiale}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Skyggebånd</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.SKYGGE.Skyggebånd}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 1</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 1"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 1"]}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 3</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 3"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 3"]}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <!-- Extra Cover -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Extra Cover</th></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Tilvælg </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Tilvælg == 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr> 
// <tr class="gap" style="height: 20px;"></tr>

// ${selectedOptions.EKSTRABETRÆK.Tilvælg == 'Ja' ? `
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Farve}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Topkant</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Topkant === 'NONE' || selectedOptions.EKSTRABETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Topkant}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// ${!shouldHideSelectors?`
//   <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kantbånd</td></tr>
//   <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.EKSTRABETRÆK.Kantbånd === 'NONE' || selectedOptions.EKSTRABETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.EKSTRABETRÆK.Kantbånd}</td></tr>
//   <tr class="gap" style="height: 20px;"></tr>
 
//   <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flagbånd</td></tr>
//   <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.EKSTRABETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.EKSTRABETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.EKSTRABETRÆK.Flagbånd}</td></tr>
//   <tr class="gap" style="height: 20px;"></tr>

//   <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner </td></tr>
//   <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
//   <tr class="gap" style="height: 20px;"></tr>
 
//   `:``}

// ${!selectedOptions.BRODERI || !selectedOptions.BRODERI.Skolebroderi  ?``:`
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Skolebroderi  </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.BRODERI.Skolebroderi}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Broderiets farve</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BRODERI['Skolebroderi farve']}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>`
// }
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Lyskugle</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Lyskugle === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Luksus champagneglas</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR['Luksus champagneglas'] === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Fløjte</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Fløjte === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>

// <tr class="gap" style="height: 20px;"></tr>
// ` : ''}


// <!-- Size -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Størrelse</th></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Vælg størrelse (Size)</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Vælg størrelse"]}</td></tr> 
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Millimeter tilpasningssæt</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.STØRRELSE["Millimeter tilpasningssæt"] === 'Ja' ? 'Ja' : 'Fravalgt'}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr class="gap" style="height: 20px;"></tr>
// </table>
// </div>
//     <div class="table-container" style="display: inline-block; vertical-align: top;">
//       <table style="border-collapse: collapse; width: 342px; margin: 0 auto;">
//                 <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Uddannelsesbånd</th></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Huebånd</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Huebånd}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Materiale</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Materiale}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Hagerem</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.UDDANNELSESBÅND.Hagerem}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
        
//         <!-- Cover -->
//         <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Betræk </th></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Farve}</td></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Topkant</td></tr>
//         <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Topkant === 'NONE' || selectedOptions.BETRÆK.Topkant === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Topkant}</td></tr>
//  <tr class="gap" style="height: 20px;"></tr>
//         ${!shouldHideSelectors?`
          
   
//    <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Kantbånd</td></tr>
//    <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Kantbånd === 'NONE' || selectedOptions.BETRÆK.Kantbånd === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Kantbånd}</td></tr>
//    <tr class="gap" style="height: 20px;"></tr>
   
//    <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner</td></tr>
//    <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.BETRÆK.Stjerner === 'NONE' || selectedOptions.BETRÆK.Stjerner === 'None' ? 'Ingen' : selectedOptions.BETRÆK.Stjerner}</td></tr>
   
//            <tr class="gap" style="height: 20px;"></tr>
          
//            <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stjerner farve</td></tr>
//            <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.KOKARDE.Emblem.name}</td></tr>
//            <tr class="gap" style="height: 20px;"></tr>
//            <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Flagbånd</td></tr>
//            <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.BETRÆK.Flagbånd ? 'Fravalgt':selectedOptions.BETRÆK.Flagbånd=='Nej' ? 'Fravalgt': selectedOptions.BETRÆK.Flagbånd}</td></tr>
//            `:``}
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr class="gap" style="height: 20px;"></tr>
//         <tr style="height: 10px;"></tr>
       
        
        
//      <!-- Inside of the cap -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Foer </th></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Svederem</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Svederem}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Farve </td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Farve}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Sløjfe</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Sløjfe}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Linje 2</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.SKYGGE["Skyggegravering Line 2"]  ? 'Ikke valgt' : selectedOptions.SKYGGE["Skyggegravering Line 2"]}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Forring</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${selectedOptions.FOER.Foer}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// ${!selectedOptions.FOER || !selectedOptions.FOER['Satin Type']  ?``:`
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Satin Type'] ? 'Ikke valgt' : selectedOptions.FOER['Satin Type']}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>`
// }

// ${!selectedOptions.FOER || !selectedOptions.FOER['Silk Type']  ?``:`
// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Satin Type</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">${!selectedOptions.FOER['Silk Type'] ? 'Ikke valgt' : selectedOptions.FOER['Silk Type']}</td></tr>
// <tr class="gap" style="height: 20px;"></tr>`
// }






//  <tr style="height: 10px;"></tr>



        
//         <!-- Tilbehør -->
// <tr><th style="font-size: 20px; padding: 10px; text-align: left;">Tilbehør</th></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Hueæske</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Hueæske === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Huekuglepen</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Huekuglepen === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Silkepude</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Silkepude === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Ekstra Kokarde</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${!selectedOptions.TILBEHØR['Ekstra korkarde Text'] ? 'Fravalgt' : selectedOptions.TILBEHØR['Ekstra korkarde Text']}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Handsker</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Handsker === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Stor kuglepen</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR["Store kuglepen"] === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Smarttag</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR["Smart Tag"] === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Lille flag</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${!selectedOptions.TILBEHØR['Lille Flag Text'] ? 'Fravalgt' : selectedOptions.TILBEHØR['Lille Flag Text']}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Trompet</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Trompet === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>

// <tr><td class="subheading" style="font-weight: bold; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">Bucketpins</td></tr>
// <tr><td class="value" style="font-size: 18px; background-color: #ffffff; text-align: left; padding: 9px; font-size: 16px;">
//   ${selectedOptions.TILBEHØR.Bucketpins === 'Ja' ? 'Ja' : 'Fravalgt'}
// </td></tr>
// <tr class="gap" style="height: 20px;"></tr>
//     </table>
//     </div>
//   </div>
//   </div>
//   <div class="gap" style="height: 20px;"></div>
//   <div class="gap" style="height: 20px;"></div>
//   <div class="gap" style="height: 20px;"></div>
//   <div class="footer" style="background-color: #e7e7e7; padding: 17px; font-weight: bold; font-size: 20px;">
//     Total: ${totalPrice} DKK <br>
//     <div class="gap" style="height: 20px;"></div> 
// Inklusiv moms <br>
// <div class="gap" style="height: 20px;"></div>
//   <hr>

// SUM: ${totalPrice} DKK<br>
// <div class="gap" style="height: 20px;"></div>
// LEVERING: 0 DKK<br>
// <div class="gap" style="height: 20px;"></div>
// MOMS: ${(totalPrice * 0.20).toFixed(2)} DKK<br>
// <div class="gap" style="height: 20px;"></div>

//   </div>

//   <!-- wrapper end  -->
//   </div>

// </body>
// </html>