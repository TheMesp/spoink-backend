require 'discordrb'
require 'json'
require_relative 'secrets.rb'
bot = Discordrb::Commands::CommandBot.new token: DISCORD_TOKEN, client_id: DISCORD_CLIENT, prefix: 's/'

bot.command(:pokemon, description: 'Prints basic information about a pokemon, including type and weaknesses', aliases: ['p','poke','weak','weakness'] ) do |event, pokemon|
	pokemon = pokemon.gsub(/[^a-zA-Z0-9\-]/,'').downcase # Clean that so i don't get injected plzty
	response = `curl -s https://pokeapi.co/api/v2/pokemon/#{pokemon}`
	if response == 'Not Found'
		return "#{pokemon} is not a recognized pokemon!"
	end
	res = JSON.parse(response)
	typestring = res['types'][0]['type']['name']
	typestring << "/#{res['types'][1]['type']['name']}" if res['types'].length() == 2
	# find strengths and weaknesses
	strengths = []
	weaknesses = []
	immunities = []
	res['types'].each do |type|
		damage_relations = JSON.parse(`curl -s #{type['type']['url']}`)['damage_relations']
		damage_relations['double_damage_from'].each do |weakness|
			name = weakness['name']
			if weaknesses.include? name
				weaknesses.delete(name)
				weaknesses << "**#{name}**"
			else
				weaknesses << name
			end
		end
		damage_relations['half_damage_from'].each do |strength|
			name = strength['name']
			if strengths.include? name
				strengths.delete(name)
				strengths << "**#{name}**"
			else
				strengths << name
			end
		end
		damage_relations['no_damage_from'].each do |immunity|
			name = immunity['name']
			if immunities.include? name
				immunities.delete(name)
				immunities << "**#{name}**"
			else
				immunities << name
			end
		end
		# TODO ability check here
	end
	event.send_embed do |embed|
		embed.title = "#{pokemon.capitalize}"
		description = "Type: **#{typestring}**"
		description << "\nType matchups (**Bold** indicates a 4x weakness/resistance):\n"
		description << "*Resists:* #{strengths.join(", ")}\n" if strengths.length() > 0
		description << "*Weak to:* #{weaknesses.join(", ")}\n" if weaknesses.length() > 0
		description << "*Immune to:* #{immunities.join(", ")}\n" if immunities.length() > 0
		embed.description = description
		embed.image = Discordrb::Webhooks::EmbedImage.new(url:"#{res['sprites']['front_default']}")
	end
end

bot.run(true)
puts 'bot active'
bot.join
