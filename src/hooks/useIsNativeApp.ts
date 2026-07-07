// Returns true when running inside the Capacitor iOS/Android wrapper.
// Used to hide in-app purchase flows that violate App Store guideline 3.1.1.
export function useIsNativeApp(): boolean {
  return typeof (window as any).Capacitor !== 'undefined'
}
