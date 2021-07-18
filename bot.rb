require 'discordrb'
require 'json'
require_relative 'secrets.rb'
bot = Discordrb::Commands::CommandBot.new token: DISCORD_TOKEN, client_id: DISCORD_CLIENT, prefix: 's/'

bot.command(:pokemon) do |event, pokemon|
	pokemon = pokemon.gsub(/[^a-zA-Z0-9\-]/,'').downcase # Clean that so i don't get injected plzty
	response = `curl -s https://pokeapi.co/api/v2/pokemon/#{pokemon}`
	if response == 'Not Found'
		return "#{pokemon} is not a recognized pokemon!"
	end
	res = JSON.parse(response)
	event.send_embed do |embed|
		embed.title = "#{pokemon.capitalize}"
		embed.image = Discordrb::Webhooks::EmbedImage.new(url:"#{res['sprites']['front_default']}")
	end
end

bot.run(true)
puts 'bot active'
bot.join
