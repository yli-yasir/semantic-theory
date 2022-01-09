from rdflib import Graph
import json
from flask import Flask, Response, request
from flask_cors import CORS, cross_origin

# Create a Graph
g = Graph()

# Parse in an RDF file hosted on the Internet
g.parse("./theory.owl")


# # Loop through each triple in the graph (subj, pred, obj)
# for subj, pred, obj in g:
#     # Check if there is at least one triple in the Graph
#     if (subj, pred, obj) not in g:
#         raise Exception("It better be!")

# # Print the number of "triples" in the Graph
# print(f"Graph g has {len(g)} statements.")
# # Prints: Graph g has 86 statements.

# qres = g.query("""PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
# PREFIX owl: <http://www.w3.org/2002/07/owl#>
# PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
# PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
# PREFIX theory: <http://www.semanticweb.org/yli-yasir/ontologies/theory#>
# SELECT ?subject ?name
# 	WHERE { ?subject theory:hasCategory ?category .
# 	                 ?subject theory:hasName ?name .
#                                          ?category  a theory:Motivation
#                                       }
# 	ORDER BY ASC(?name)""")

# json = qres.serialize(format="json")

app = Flask(__name__)
CORS(app)


@app.route('/sparql', methods=['POST'])
@cross_origin()
def handleQuery():
    query = request.get_json(force=True)["query"]
    print(query)
    query_result = g.query(query).serialize(format="json")
    return Response(query_result, mimetype='application/json')
