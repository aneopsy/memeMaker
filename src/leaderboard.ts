import { web3 } from "@project-serum/anchor";
import kleur from "kleur";
import { getConnection } from "./helpers/connection";
import { chunks, loadFile } from "./helpers/various";
import pixsols from "./helpers/pixsols";
import { uploadS3 } from "./helpers/aws";

const THREADS = 20;

(async () => {
  const connection = getConnection("mainnet-beta");
  const mints = pixsols;
  const holders = {};
  const exclude = [
    "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr", //digitalEyesMarket
    "GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp", //magicEdenMarket
    "3D49QorJyNaL4rcpiynbuS3pRH4Y7EXEM6v6ZGaqfFGK", //solanartMarket
    "4pUQS4Jo2dsfWzt3VgHXy3H6RYnEDd11oWPiaM2rdAPw", //alphaArtMarket
  ];
  let done = 0;
  await Promise.all(
    chunks(mints, Math.ceil(mints.length / THREADS)).map(
      async (mintAddresses: string[]) => {
        for (let index in mintAddresses) {
          const mint = mintAddresses[index];
          const owners = await connection.getTokenLargestAccounts(
            new web3.PublicKey(mint)
          );
          const ownerAccount = owners.value[0].address;
          const accountInfo = (
            await connection.getParsedAccountInfo(ownerAccount)
          ).value;
          if (accountInfo && "parsed" in accountInfo.data) {
            if (exclude.includes(accountInfo.data.parsed.info.owner)) {
              console.log("Exclude Marketplace");
              done++;
              continue;
            }
            holders[mint] = accountInfo.data.parsed.info.owner;
            console.log(`+ (${done++}/${mints.length})`);
          }
        }
      }
    )
  );
  console.log(kleur.bold().yellow(`Total: ${Object.keys(holders).length}`));
  await uploadS3(
    "pixsols-config",
    "leaderboard.json",
    JSON.stringify({ timestamp: Date.now(), holders })
  );
})();
