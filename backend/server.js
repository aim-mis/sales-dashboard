const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const config = {
  server: process.env.DB_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
    connectTimeout: 30000,
  },
};

const queryString = `
with tblManila as
(
	select c.validFor, c.CardName, i.U_GroupCategory, c.U_BDO, o.SlpName
	from
	arvinaim.dbo.ORDR a
	inner join ARVINAIM.dbo.RDR1 b on a.docentry = b.docentry
	inner join ARVINAIM.dbo.OCRD c on a.cardcode = c.CardCode
	inner join ARVINAIM.dbo.OITM i on i.itemcode = b.ItemCode
	left join ARVINAIM.dbo.OSLP o on c.SlpCode = o.SlpCode
	where i.U_GroupCategory in ('PVD SALT', 'INDUSTRIAL SALT', 'RICE', 'CONDENSE' )
	and c.validFor = 'Y'
	GROUP BY c.validFor, c.CardName, i.U_GroupCategory, c.U_BDO, o.SlpName
),

tblProvince as
(
	select c.validFor, c.CardName, CASE WHEN i.U_GroupCategory = 'CONDENSADA' THEN 'CONDENSE' ELSE I.U_GroupCategory END U_GroupCategory, bdo.name u_bdo, o.SlpName
	from
	PROVINCE.dbo.ORDR a
	inner join PROVINCE.dbo.RDR1 b on a.docentry = b.docentry
	inner join PROVINCE.dbo.OCRD c on a.cardcode = c.CardCode
	inner join PROVINCE.dbo.OITM i on i.itemcode = b.ItemCode
	left join PROVINCE.dbo.OSLP o on c.SlpCode = o.SlpCode
	left join province.dbo.[@BDO] bdo on c.u_bdo COLLATE SQL_Latin1_General_CP1_CI_AS = bdo.code COLLATE SQL_Latin1_General_CP1_CI_AS
	where i.U_GroupCategory in ('PVD SALT', 'INDUSTRIAL SALT', 'RICE', 'CONDENSADA' )
	and c.validFor = 'Y'
	GROUP BY c.validFor, c.CardName, i.U_GroupCategory, c.U_BDO, o.SlpName, bdo.name
)
SELECT 'MANILA' [SOURCE], validFor [ACTIVE], CardName [CLIENT_NAME], U_GroupCategory [PRODUCT_LINE], U_BDO [BDO], SlpName [BDO TEAM] FROM tblManila
UNION ALL
SELECT 'PROVINCE' [SOURCE], validFor [ACTIVE], CardName [CLIENT_NAME], U_GroupCategory [PRODUCT_LINE], u_bdo [BDO], SlpName [BDO TEAM] FROM tblProvince
`;

app.get('/api/data', async (req, res) => {
  try {
    console.log(`Attempting to connect to SQL Server at ${config.server}`);
    const pool = new sql.ConnectionPool(config);
    await pool.connect();

    console.log('Connected successfully! Executing query...');
    const result = await pool.request().query(queryString);

    console.log('Query executed. Records returned:', result.recordset.length);
    await pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Database Error Details:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/product-counts', async (req, res) => {
  try {
    console.log('Fetching product line counts...');
    const pool = new sql.ConnectionPool(config);
    await pool.connect();

    const result = await pool.request().query(`
      with tblManila as
      (
        select c.validFor, c.CardName, i.U_GroupCategory
        from arvinaim.dbo.ORDR a
        inner join ARVINAIM.dbo.RDR1 b on a.docentry = b.docentry
        inner join ARVINAIM.dbo.OCRD c on a.cardcode = c.CardCode
        inner join ARVINAIM.dbo.OITM i on i.itemcode = b.ItemCode
        where i.U_GroupCategory in ('PVD SALT', 'INDUSTRIAL SALT', 'RICE', 'CONDENSE' )
        and c.validFor = 'Y'
        GROUP BY c.validFor, c.CardName, i.U_GroupCategory
      ),
      tblProvince as
      (
        select c.validFor, c.CardName,CASE WHEN i.U_GroupCategory = 'CONDENSADA' THEN 'CONDENSE' ELSE I.U_GroupCategory END U_GroupCategory
        from PROVINCE.dbo.ORDR a
        inner join PROVINCE.dbo.RDR1 b on a.docentry = b.docentry
        inner join PROVINCE.dbo.OCRD c on a.cardcode = c.CardCode
        inner join PROVINCE.dbo.OITM i on i.itemcode = b.ItemCode
        where i.U_GroupCategory in ('PVD SALT', 'INDUSTRIAL SALT', 'RICE', 'CONDENSADA' )
        and c.validFor = 'Y'
        GROUP BY c.validFor, c.CardName, i.U_GroupCategory
      ),
      allData as (
        SELECT 'MANILA' [SOURCE], validFor [ACTIVE], CardName [CLIENT_NAME], U_GroupCategory [PRODUCT_LINE] FROM tblManila
        UNION ALL
        select 'PROVINCE', validFor, CardName, U_GroupCategory from tblProvince
      )
      SELECT [PRODUCT_LINE], COUNT(DISTINCT [CLIENT_NAME]) as client_count
      FROM allData
      GROUP BY [PRODUCT_LINE]
      ORDER BY [PRODUCT_LINE]
    `);

    await pool.close();

    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error fetching product counts:');
    console.error('Message:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard backend running on http://localhost:${PORT}`);
});
