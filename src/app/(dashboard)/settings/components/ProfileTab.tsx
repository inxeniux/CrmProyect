"use client";

export default function ProfileTab() {
  return (
    <div className="border-b border-light-border-light dark:border-dark-border-light pb-12">
      <h2 className="text-base/7 font-semibold text-light-text-primary dark:text-dark-text-primary">
        Perfil
      </h2>
      <p className="mt-1 text-sm/6 text-light-text-secondary dark:text-dark-text-secondary">
        Esta información será visible públicamente, ten cuidado con lo que
        compartes.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label className="block text-sm/6 font-medium text-light-text-primary dark:text-dark-text-primary">
            Nombre de usuario
          </label>
          <div className="mt-2">
            <div className="flex rounded-md bg-light-bg-input dark:bg-dark-bg-input pl-3 outline outline-1 outline-light-border-medium dark:outline-dark-border-medium">
              <span className="text-light-text-tertiary dark:text-dark-text-tertiary p-2">
                micuenta.com/
              </span>
              <input
                type="text"
                placeholder="juanperez"
                className="grow border-none py-1.5 pl-1 bg-transparent text-light-text-primary dark:text-dark-text-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Rest of the profile form components */}
        {/* ... existing profile fields ... */}
      </div>
    </div>
  );
}
