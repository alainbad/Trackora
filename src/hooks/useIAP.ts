import { useEffect, useState, useCallback } from 'react'
import { useIsNativeApp } from './useIsNativeApp'

export type IAPProduct = {
  id: string
  title: string
  price: string
  period: 'monthly' | 'annual'
  tier: 'pro' | 'business'
}

export type PurchaseState = 'idle' | 'loading' | 'success' | 'error'

const PRODUCTS: IAPProduct[] = [
  { id: 'com.trackora.pro.monthly',      title: 'Pro Monthly',      price: '$4.99/mo',  period: 'monthly', tier: 'pro' },
  { id: 'com.trackora.pro.annual',       title: 'Pro Annual',       price: '$39.99/yr', period: 'annual',  tier: 'pro' },
  { id: 'com.trackora.business.monthly', title: 'Business Monthly', price: '$14.99/mo', period: 'monthly', tier: 'business' },
  { id: 'com.trackora.business.annual',  title: 'Business Annual',  price: '$119.99/yr',period: 'annual',  tier: 'business' },
]

declare global {
  interface Window {
    CdvPurchase?: any
  }
}

export function useIAP(onPurchaseComplete: (tier: 'pro' | 'business') => Promise<void>) {
  const isNative = useIsNativeApp()
  const [products, setProducts] = useState<IAPProduct[]>(PRODUCTS)
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isNative) return

    const initStore = () => {
      const store = window.CdvPurchase?.store
      if (!store) return

      store.verbosity = window.CdvPurchase.LogLevel.DEBUG

      PRODUCTS.forEach(p => {
        store.register({
          id: p.id,
          type: window.CdvPurchase.ProductType.PAID_SUBSCRIPTION,
          platform: window.CdvPurchase.Platform.APPLE_APPSTORE,
        })
      })

      store.when().productUpdated((product: any) => {
        setProducts(prev => prev.map(p =>
          p.id === product.id
            ? { ...p, price: product.pricing?.price ?? p.price }
            : p
        ))
      })

      store.when().approved((transaction: any) => {
        transaction.verify()
      })

      store.when().verified((receipt: any) => {
        receipt.finish()
        const productId: string = receipt.transaction?.products?.[0]?.id ?? ''
        const product = PRODUCTS.find(p => p.id === productId)
        if (product) {
          setPurchaseState('success')
          onPurchaseComplete(product.tier).catch(console.error)
        }
      })

      store.when().unverified(() => {
        setPurchaseState('error')
        setError('Purchase could not be verified. Please try again.')
      })

      store.initialize([window.CdvPurchase.Platform.APPLE_APPSTORE]).then(() => {
        setReady(true)
      })
    }

    if (document.readyState === 'complete') {
      setTimeout(initStore, 300)
    } else {
      document.addEventListener('deviceready', initStore, { once: true })
    }
  }, [isNative])

  const purchase = useCallback(async (productId: string) => {
    if (!isNative || !window.CdvPurchase?.store) return
    setPurchaseState('loading')
    setError(null)
    try {
      const offer = window.CdvPurchase.store
        .get(productId, window.CdvPurchase.Platform.APPLE_APPSTORE)
        ?.offers?.[0]
      if (!offer) throw new Error('Product not available')
      await window.CdvPurchase.store.order(offer)
    } catch (e: any) {
      setPurchaseState('error')
      setError(e?.message ?? 'Purchase failed')
    }
  }, [isNative])

  const restorePurchases = useCallback(async () => {
    if (!isNative || !window.CdvPurchase?.store) return
    setPurchaseState('loading')
    setError(null)
    try {
      await window.CdvPurchase.store.restorePurchases()
      setPurchaseState('idle')
    } catch (e: any) {
      setPurchaseState('error')
      setError(e?.message ?? 'Restore failed')
    }
  }, [isNative])

  return { products, purchaseState, error, ready, purchase, restorePurchases }
}
