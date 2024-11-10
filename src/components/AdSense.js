'use client'

import { useEffect } from 'react'

export default function AdSense() {
    const isAdSenseEnabled = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true'

    useEffect(() => {
      if (isAdSenseEnabled) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error(err);
        }
      }
    }, [isAdSenseEnabled]);
  
    if (!isAdSenseEnabled) {
      return null;
    }
  return (
    <div className="mb-4">
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client={process.env.ADSENSE_CLIENT_ID}
           data-ad-slot={process.env.ADSENSE_SLOT_ID}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  )
}