import { useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'

/**
 * Hook para guardar el progreso de un formulario en cookies.
 * Los datos se restauran automáticamente al montar el componente
 * y se limpian cuando se llama a clearDraft().
 *
 * @param cookieName - Nombre de la cookie (ej: "reg_draft")
 * @param defaultValues - Valores iniciales del formulario
 * @param setValue - Función setValue de react-hook-form
 */
export function useCookieForm<T extends Record<string, unknown>>(
  cookieName: string,
  defaultValues: T,
  setValue: (name: keyof T & string, value: unknown) => void
) {
  // Al montar, restaurar borrador desde cookie
  useEffect(() => {
    try {
      const saved = Cookies.get(cookieName)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<T>
        // Restaurar solo campos no sensibles (nunca contraseñas)
        Object.entries(parsed).forEach(([key, value]) => {
          if (key !== 'password' && key !== 'passwordConfirm' && key in defaultValues) {
            setValue(key as keyof T & string, value)
          }
        })
      }
    } catch {
      // Si la cookie está corrupta, la ignoramos
      Cookies.remove(cookieName)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Guardar valores actuales en la cookie (excluye contraseñas)
  const saveDraft = useCallback((values: Partial<T>) => {
    const safe = { ...values }
    delete (safe as Record<string, unknown>)['password']
    delete (safe as Record<string, unknown>)['passwordConfirm']

    Cookies.set(cookieName, JSON.stringify(safe), {
      expires: 7,     // 7 días
      sameSite: 'strict',
      secure: window.location.protocol === 'https:',
    })
  }, [cookieName])

  // Limpiar borrador al completar el formulario
  const clearDraft = useCallback(() => {
    Cookies.remove(cookieName)
  }, [cookieName])

  return { saveDraft, clearDraft }
}
