import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group bg-red-600"
      toastOptions={{
        classNames: {
          toast: "group toast",
          description:
            "group-[.toast]:text-slate-700 dark:group-[.toast]:text-slate-800",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400",
        },
      }}
      {...props}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        border: '1px solid #F5C6CB',
        boxShadow: '0 4px 6px rgba(71, 255, 145, 0.69)',
        zIndex: 9999
      }}
    />
  )
}

export { Toaster }
