<#macro kw>
  <body class="w-screen p-4 min-w-screen bg-secondary-100 flex gap-4 items-center justify-around p-4 max-h-auto">
    <div class="w-1/2 hidden md:block">
      <img src="https://dev.a2apoint.com/keycloak/login-hero-image.png" alt="login-hero-image" class="w-full h-[calc(100vh-2rem)] object-contain" />
    </div>
    <div class="w-full md:w-1/2 max-w-sm flex items-center justify-center h-full py-12">
      <div class="flex flex-col gap-8 justify-center items-center">
        <img src="https://dev.a2apoint.com/logo.svg" alt="logo" class="w-40 object-contain" />
        <#nested>
      </div>
    </div>
  </body>
</#macro>
