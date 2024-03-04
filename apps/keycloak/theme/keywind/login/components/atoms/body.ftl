<#macro kw>
  <body class="h-screen min-h-screen w-screen p-4 min-w-screen bg-secondary-100 flex gap-4 items-center justify-around min-h-screen sm:py-16">
    <div class="w-1/2 h-full hidden md:block">
      <img src="https://cdn.pixabay.com/photo/2014/09/30/22/50/sandstone-467714_1280.jpg" alt="Knowhere" class="w-full h-full object-contain" />
    </div>
    <div class="w-full md:w-1/2 max-w-sm">
      <#nested>
    </div>
  </body>
</#macro>
