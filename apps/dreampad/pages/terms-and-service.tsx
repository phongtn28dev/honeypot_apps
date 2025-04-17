// import Discord from "@/components/svg/Discord";
// import Twitter from "@/components/svg/Twitter";
// import clsx from "clsx";
// import Link from "next/link";
import React from "react";

type Props = {};

const ContentTitleWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-[20px] leading-[26px]">{title}</h2>
      {children}
    </div>
  );
};

const TermsAndService = (props: Props) => {
  return (
    <div>
      {/* <div className='flex flex-col gap-6 max-w-7xl mx-auto xl:px-7 px-2 pb-16'>
        <div className='flex flex-col gap-2'>
            <h1 className='font-bold text-[28px] leading-9'>Terms of Use</h1>
            <h3 className='text-2xl leading-8 text-white/55'>Last Updated: February 1st, 2023</h3>
            <p className='mt-2 font-normal text-sm leading-[18px] text-justify'>All pools on our Platform except for Sweeper Pools are NOT offered to persons or entities who reside in, are citizens of, are incorporated in, or have a registered office in the United States of America or any Prohibited Localities, namely Restricted Persons, as defined below. We do not make exceptions. If you are a Restricted Person, then do not attempt to access or use the Interface. Use of a virtual private network (e.g., a VPN) or other means by Restricted Persons to access or use the Interface is prohibited. Do not access this site where such access is prohibited by applicable law. Please carefully read these terms of use before using the site. These terms apply to any person or entity accessing the site and by using the site you agree to be bound by them. The terms of use contain a mandatory individual arbitration and class action/jury trial waiver provision that requires the use of arbitration on an individual basis to resolve disputes, rather than jury trials or class actions. If you do not want to be bound by these terms of use, you should not access the site. By using the site in any capacity, you agree that you have read, understood, and agree to be subject to these terms of use.</p>
        </div>
        <div className='flex flex-col gap-9'>
            <ContentTitleWrapper title='1. Overview'>
                <div className='flex flex-col gap-[18px] text-justify text-sm leading-[18px] font-normal'>
                    <div>This Fjord Foundry Terms of Use agreement (“Terms” or “agreement”) (“Fjord Foundry”, “we” and “us” refers to Fjord Foundry) covers the website, Fjord Foundry user-interface and application (collectively “the Site”) we own and administer, at times in conjunction with others, which provides the ability to access the decentralized Fjord Foundry Protocol. Additionally, you can access the Fjord Foundry through third-party web or mobile interfaces. These Terms apply to you (“You” or “you”) as a user of our Site including all the products, services, tools and information, without limitation, made available on the Site</div>
                    <div>You must be able to form a legally binding contract online either as an individual or on behalf of a legal entity. You represent that, if you are agreeing to these Terms on behalf of a legal entity, you have the legal authority to bind that entity to these Terms and you are not indirectly or directly included on any sanctions list and at least 18 years old or the age of majority where you reside, (whichever is older) can form a legally binding contract online, and have the full, right, power and authority to enter into and to comply with the obligations under these Terms.</div>
                    <div>You are advised to periodically review these Terms so you understand any changes to the Terms. Fjord Foundry in its sole discretion, reserves the right to make changes to our Terms. Changes are binding on users of the Site and will take effect immediately upon posting. As a user, you agree to be bound by any changes, variations, or modifications to our Terms and your continued use of the Site shall constitute acceptance of any such changes, revisions, variations, or modifications. When we make changes, we will make the updated Terms available on the interface and update the “Last Updated” date at the beginning of the Terms accordingly.</div>
                    <div>You accept such changes, by continuing to use the Site and by doing so you agree that we have provided you with sufficient notice of such change. Our Privacy Policy and Cookies Policy also apply to your access and use of the Site.</div>
                </div>
            </ContentTitleWrapper>
            <ContentTitleWrapper title='2. Eligibility'>
                <div className='text-justify text-sm leading-[18px] font-normal'>General. You may not use the Platform if you are otherwise barred from using the Platform under applicable law. Legality. You are solely responsible for adhering to all laws and regulations applicable to you and your use or access to the Platform. Your use of the Platform is prohibited by and otherwise violate or facilitate the violation of any applicable laws or regulations, or contribute to or facilitate any illegal activity. By using or accessing the Platform, you represent to us that you are not subject to the Sanction Lists and you are not a Restricted Person, as defined below. “Sanction Lists” means any sanctions designations listed on economic/trade embargo lists and/or specially designated persons/blocked persons lists published by the international organisations, as well as any state and governmental authorities of any jurisdiction, including, but not limited to the lists of United Nations, European Union and its Member States, United States and United Kingdom sanctions lists. We make no representations or warranties that the information, products, or services provided through our Platform, are appropriate for access or use in other jurisdictions. You are not permitted to access or use our Platform in any jurisdiction or country if it would be contrary to the law or regulation of that jurisdiction or if it would subject us to the laws of, or any registration requirement with, such jurisdiction. We reserve the right to limit the availability of our Platform to any person, geographic area, or jurisdiction, at any time and at our sole and absolute discretion. Prohibited Localities. Fjord Foundry does not interact with digital wallets located in, established in, or a resident of Myanmar (Burma), Cote D'Ivoire (Ivory Coast), Cuba, Crimea and Sevastopol, Democratic Republic of Congo, Iran, Iraq, Libya, Mali, Nicaragua, Democratic People’s Republic of Korea (North Korea), Somalia, Sudan, Syria, Yemen, Zimbabwe or any other state, country or region that is included in the Sanction Lists. You must not use any software or networking techniques, including use of a Virtual Private Network (VPN) to modify your internet protocol address or otherwise circumvent or attempt to circumvent this prohibition. Restricted Persons. Fjord Foundry does not interact with digital wallets, which have been previously classified or otherwise identified by international organizations or any state and governmental authorities of any jurisdiction, as belonging or affiliated with the persons specially designated or otherwise included in the Sanction Lists (“Restricted Persons”). For the purposes of these Terms, Restricted Persons shall also include all persons or entities who reside in, are citizens of, are incorporated in, or have a registered office in the Prohibited Localities. Fjord Foundry utilizes TRM to identify and prevent wallets from utilizing our UI for violating compliance requirements. Non-Circumvention. You agree not to access the Platform using any technology for the purposes of circumventing these Terms.</div>
            </ContentTitleWrapper>
            <ContentTitleWrapper title='3. Site'>
                <div className='flex flex-col gap-[18px] text-justify text-sm leading-[18px] font-normal'>
                    <div>As part of the Site, Fjord Foundry provides access to a decentralized finance application (“Application” or “Fjord Foundry dapp”) on the Ethereum, Polygon, Arbitrum, BNB, Optimism, and Avalanche blockchains, that allows users of blockchain assets (“Cryptocurrency Assets”) to transact using smart contracts (“Smart Contracts”). Use of the Fjord Foundry may require that you pay a fee, such as gas charges on the Ethereum network to perform a transaction. You acknowledge and agree that Fjord Foundry has no control over any activities, transactions, the method of payment of any transactions, or any actual processing of payments of transactions. You must ensure that you have a sufficient balance to complete any transaction on the Fjord Foundry before initiating such transaction.</div>
                    <div>You acknowledge and agree that the Fjord Foundry has no control over any transactions conducted through the Fjord Foundry, the method of payment of any transactions or any actual payments of transactions including use of any third-party services such as Metamask, or other wallet services. Likewise, you must ensure that you have a sufficient balance of the applicable cryptocurrency tokens stored at your Fjord Foundry-compatible wallet address (“Cryptocurrency Wallet”) to complete any transaction on the Fjord Foundry or the Ethereum network before initiating such a transaction.</div>
                </div>
            </ContentTitleWrapper>
            <ContentTitleWrapper title='4. Plataform Access Fee'>
                <div className='text-justify text-sm leading-[18px] font-normal'>Fjord Foundry applies a $2% platform access fee for standard LBPs and a $0% platform access fee for sweeper pools on the quantity accrued to the base token balance at the conclusion of a Liquidity Bootstrapping Pool/Token Sale (LBP). Conclusion is defined by the owner's withdrawl of liquidity of main and base token balances from the Sale. The quantity accrued is inclusive of accrual to the base tokens due to swaps and due to swap fees.</div>
            </ContentTitleWrapper>
            <ContentTitleWrapper title='5. Access / Disclaimer of Warranties'>
                <div className='flex flex-col gap-[18px] text-justify text-sm leading-[18px] font-normal'>
                    <div>ACCESS TO THIS SITE AND THE PRODUCTS HEREIN ARE PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. NO WARRANTY IS PROVIDED THAT THE SITE OR ANY PRODUCT WILL BE FREE FROM DEFECTS OR VIRUSES OR THAT OPERATION OF THE PRODUCT WILL BE UNINTERRUPTED. YOUR USE OF THE SITE AND ANY PRODUCT AND ANY MATERIAL OR SERVICES OBTAINED OR ACCESSED VIA THE SITE IS AT YOUR OWN DISCRETION AND RISK, AND YOU ARE SOLELY RESPONSIBLE FOR ANY DAMAGE RESULTING FROM THEIR USE. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.</div>
                    <div>We do not guarantee or promise that the Site, or any content on it, will always be available, functional, usable or uninterrupted. From time to time, access may be interrupted, suspended or restricted, including because of a fault, error or unforeseen circumstances or because we are carrying out planned maintenance or changes.</div>
                    <div>We reserve the right to limit the availability of the site to any person, geographic area or jurisdiction in our sole discretion and/or to terminate your access to and use of the site, at any time and in our sole discretion. We may suspend or disable your access to the Site for any reason and in our sole discretion, including for any intentional or unintentional breaches of these Terms. We may remove or amend the content of the Site at any time. Some of the content may be out of date at any given time and we are under no obligation to update or revise it. We do not promise or guarantee that the Site, or any content on it, will be free from errors or omissions</div>
                    <div>We will not be liable to you for any issue, loss or damage you may or have suffered as a result of the Site being unavailable at any time for any reason. You will comply with all applicable domestic and international laws, statutes, ordinances, rules and regulations applicable to your use of the site (“Applicable Laws”).</div>
                    <div>
                        As a condition to accessing or using the Site, you agree and represent that you will:
                        <ul className='list-disc list-inside'>
                            <li>Only use the Services and the Site for lawful purposes and in adherence with these Terms</li>
                            <li>Ensure that all information that you provide on the Site is current, complete, and accurate</li>
                            <li>Maintain the security, privacy and confidentiality of access to your cryptocurrency wallet address.</li>
                        </ul>
                    </div>
                    <div>
                    As a condition to accessing or using the Site or the Services, you will not:
                        <ul className='list-disc list-inside text-justify'>
                            <li>Violate any Applicable Law, including, without limitation, any relevant and applicable anti-money laundering and anti-terrorist financing and sanctions laws and any relevant and applicable privacy, secrecy and data protection laws.</li>
                            <li>Use the Site for any purpose or conduct that is directly or indirectly unlawful.</li>
                            <li>Export, reexport, or transfer, directly or indirectly, any Fjord Foundry technology in violation of applicable export laws or regulations.</li>
                            <li>Infringe on or misappropriate any contract, intellectual property, or other third-party right, or commit a tort while using the Site.</li>
                            <li>Misrepresent, with omission or otherwise, the truthfulness, sourcing, or reliability of any content on the Site.</li>
                            <li>Use the Site in any manner that could interfere with, disrupt, negatively affect, redirect or inhibit other users from fully enjoying the Site or the Fjord Foundry, or that could damage, disable, overburden, or impair the functioning of the Site or the Fjord Foundry in any manner.</li>
                            <li>Attempt to circumvent or disable any content filtering techniques or security measures that Fjord Foundry employs on the Site, or attempt to access any service or area of the Site that you are not authorized to access.</li>
                            <li>Use any robot, spider, crawler, scraper, or other automated means or interface not provided by us, to access the Site to extract data.</li>
                            <li>Introduce or use any malware, virus, Trojan horse, worm, logic bomb, drop-dead device, backdoor, shutdown mechanism, or other harmful material into the Site.</li>
                            <li>Post content or communications on the Site that are, in our sole discretion, libelous, defamatory, profane, obscene, pornographic, sexually explicit, indecent, lewd, vulgar, suggestive, harassing, hateful, threatening, offensive, discriminatory, bigoted, abusive, inflammatory, fraudulent, deceptive, or otherwise objectionable.</li>
                            <li>To the extent applicable, post content on the Site containing unsolicited promotions, commercial messages, or any chain messages or user content designed to deceive, induce, or trick the user of the Site.</li>
                            <li>Encourage or induce any third party to engage in any of the activities prohibited under these Terms.</li>
                        </ul>
                    </div>
                    <ul className='list-disc list-inside'>
                        <li>5 (a). You acknowledge that the Site and your use of the Site present certain risks, including without limitation the following risks:</li>
                        <li>Losses while digital assets are being supplied to the Fjord Foundry and losses due to the fluctuation of prices of tokens in a transaction pair or liquidity pool. Prices of digital assets fluctuate day by day or even minute by minute. The value of your available balance could surge or drop suddenly. Please note that there is a possibility that the price of tokens could decrease to zero. Prices of tokens are prone to significant fluctuations, for example, due to announced proposed legislative acts, governmental restrictions, news related to cyber crimes or other factors causing potentially excessive market enthusiasm, disproportionate loss in confidence, or manipulation by others in the market.</li>
                        <li>Risks associated with accessing the Fjord Foundry through third-party web or mobile interfaces. You are responsible for doing your own diligence on those interfaces to understand and accept the risks that use entails. You are also responsible for doing your own diligence on those interfaces to understand and accept any fees that those interfaces may charge.</li>
                        <li>Risks associated with any Smart Contracts with which you interact.</li>
                        <li>Although Fjord Foundry does not have access to your assets, you are reminded and acknowledge that at any time, your access to your Cryptocurrency Assets through third-party wallet services, unrelated to Fjord Foundry, may be suspended or terminated or there may be a delay in your access or use of your Cryptocurrency Assets, which may result in the Cryptocurrency Assets diminishing in value or you being unable to complete a Smart Contract.</li>
                        <li>You are reminded of the inherent risks with digital assets and decentralized finance including the fact that tokens are not legal tender and are not backed by any government. Unlike fiat currencies, which are regulated and backed by local governments and central banks, tokens are based only on technology and user consensus, which means that in cases of manipulations or market panic, central governments will not take any corrective actions or measures to achieve stability, maintain liquidity or protect their value. There is a possibility that certain transactions cannot be settled or may be difficult to settle, or can be completed only at significantly adverse prices depending on the market situation and/or market volume. Transactions may be irreversible, and, accordingly, potential losses due to fraudulent or accidental transactions are not recoverable. Some blockchain transactions are deemed to be completed when recorded on a public ledger, which is not necessarily the date or time when you or another party initiated the transaction.</li>
                        <li>The regulatory frameworks applicable to blockchain transactions in connection with tokens are still developing and evolving. It is possible that your transactions or funds are, or may be in the future, subject to various reporting, tax or other liabilities and obligations. Legislative and regulatory changes or actions at the country or international level may materially and adversely affect the use, transfer, exchange, and value of your tokens.</li>
                        <li>The site and/or application may be wholly or partially suspended or terminated for any or no reason, which may limit your access to your Cryptocurrency Assets.</li>
                        <li>You are solely responsible for understanding and complying with any and all Applicable Laws in connection with your acceptance of these Terms and your use of any part of the Site, including but not limited to those related to taxes as well as reporting and disclosure obligations.</li>
                        <li>This list of risk factors is non-exhaustive, and other risks, arising either now or in the future, could additionally be relevant and applicable to you in making an informed judgement to accept, or continue to accept, these Terms and/or use, or continue to use the Site.</li>
                    </ul>
                </div>
            </ContentTitleWrapper>
        </div>
    </div>
    <div className=' bg-[#271A0C]'>
        <div className='max-w-7xl mx-auto xl:px-7 px-2 py-[37px]'>
            <div className='flex flex-col gap-[50px]'>
                <div className='font-bold text-xl leading-[26px] text-white/55'>To become a curator, service provider or just report a bug <Link href={'/'} className='text-white text-2xl leading-[26px] underline'>Contact Us</Link></div>
                <div className='flex justify-between'>
                    <div className='text-xl leading-[26px] font-bold text-white/55'>Documentation  Terms & Conditions  Privacy Policy</div>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold text-xl leading-[26px] text-white/55'>Follow us:</div>
                        <Link href={'/'} target='_blank' className='flex gap-2 items-center justify-center px-[14px] py-2.5 border rounded-xl bg-[#3E2A0FC4] border-[#F7931AA8] text-sm leading-5 font-normal'><Discord/> Discord</Link>
                        <Link href={'/'} target='_blank' className='flex gap-2 items-center justify-center px-[14px] py-2.5 border rounded-xl bg-[#3E2A0FC4] border-[#F7931AA8] text-sm leading-5 font-normal'><Twitter/> Twitter</Link>
                    </div>
                </div> 
            </div>
        </div>
    </div> */}
    </div>
  );
};

export default TermsAndService;
