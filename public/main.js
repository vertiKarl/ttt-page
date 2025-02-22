/**
 * Performs a DNS lookup using the specified DNS resolver URL and domain name.
 *
 * @param {string} lookupUrl - The DNS resolver URL.
 * @param {string} domain - The domain to look up.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response of the DNS lookup.
 */
async function dnsLookup(lookupUrl, domain) {
  try {
    // Construct the full URL with the query parameter
    const url = new URL(lookupUrl);
    url.searchParams.append("name", domain);

    // Send the request and wait for the response
    const response = await fetch(url.toString());

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse and return the JSON data
    return await response.json();
  } catch (error) {
    console.error("DNS Lookup failed:", error);
    throw error;
  }
}

async function getIp() {
  const res = await dnsLookup("https://dns.google/resolve", "ttt.karlology.eu");
  if (!res || !res.Answer || !res.Answer[0] || !res.Answer[0].data) return null;

  return res.Answer[0].data;
}

async function generateLink() {
  const ip = await getIp();
  if (ip) {
    /*
    Steam Connect URL Schema:
    steam://connect/<IP>[:<port>][/<password>]
    */
    return `steam://connect/${ip}:27015`;
  } else {
    return "";
  }
}

function copyLink() {
  const linkbox = document.getElementById("linkbox");
  const linkbutton = document.getElementById("linkbutton");
  linkbutton.disabled = true;
  const copybutton = document.getElementById("copybutton");
  copybutton.disabled = true;
  const link = linkbox.href;
  navigator.clipboard.writeText(link);

  linkbox.innerHTML = "Copied to clipboard";

  setTimeout(() => {
    linkbox.innerHTML = link;
    linkbutton.disabled = false;
    copybutton.disabled = false;
  }, 1500);
}

window.onload = async () => {
  for (const element of document.getElementsByClassName("script")) {
    element.classList.remove("script");
  }

  const link = await generateLink();
  const linkbox = document.getElementById("linkbox");
  linkbox.href = link;
  linkbox.innerHTML = link;

  if (link) {
    window.location.href = await generateLink();
  } else {
    console.error(
      "Sorry but it seems like the domain is currently not resolvable check back later."
    );
  }
};
