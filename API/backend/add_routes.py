from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from models.route import RoutesModel

import os, json
import geopy.distance
import gpxpy
import gpxpy.gpx

def format_coordinates(jsonObject):
    coordinates = []
    elevation = 0
    step = 1

    #Estamos limitados a 25 waypoints por ruta -> INCIO - WAYPOINTS - DESTINO = 25
    if(len(jsonObject) > 23):
        step = int(len(jsonObject)/23) 
    for i in range(0, len(jsonObject)-1, step):
        coordinates.append([jsonObject[i]['lon'], jsonObject[i]['lat']])
        elevation += jsonObject[i]['ele']
    
    coordinates.append([jsonObject[-1]['lon'], jsonObject[-1]['lat']])
    elevation /= len(jsonObject)
    #print(len(coordinates))

    coordsStr = "["

    #Convertimos el array a string
    for ele in coordinates:
        coordsStr += "["
        for coord in ele:
            coordsStr += str(coord)
            coordsStr += ','
        coordsStr += "],"
    
    coordsStr += "]"

    coordsStr = coordsStr.replace(",]", "]")
        
    # print(coordsStr)
    return coordsStr, elevation

def calculate_distance(jsonObject):
    distance = 0
    for i in range(len(jsonObject)-1):
        coord1 = (jsonObject[i]['lon'], jsonObject[i]['lat'])
        coord2 = (jsonObject[i+1]['lon'], jsonObject[i+1]['lat'])
        distance += geopy.distance.geodesic(coord1 , coord2).km
    
    #print(round(distance, 2))
    return round(distance, 2)

#RUTAS NORMALES
def db_circular_routes(app, db):

    path = "C:/Users/Marc/Desktop/Rutes/"
    dirct = os.listdir(path)

    for filename in dirct:
        if filename.endswith('.js'):
            f = open(path + '/' + filename)
            data = json.load(f)
            coordinates, elevation = format_coordinates(data['data']['trackData'][0])
            distance = calculate_distance(data['data']['trackData'][0])

            if (distance <= 2.5):
                new_route = RoutesModel(filename.split('.')[0], "FACIL", "PASEO", distance, "CIRCULAR", 
                coordinates, elevation, "NORMAL")
            if (distance > 2.5 and distance <= 4.5):
                new_route = RoutesModel(filename.split('.')[0], "MITJA", "PASEO", distance, "CIRCULAR", 
                coordinates, elevation, "NORMAL")
            if (distance > 4.5):
                new_route = RoutesModel(filename.split('.')[0], "DIFICIL", "PASEO", distance, "CIRCULAR", 
                coordinates, elevation, "NORMAL")

            with app.app_context():
                if not RoutesModel.find_by_name(new_route.name): #Para no añadir rutas repetidas
                    db.session.add(new_route)
                    db.session.commit()
                    db.session.close()

# RUTAS ZONAS VERDES
def db_zonas_verdas_routes(app, db):
    path = "C:/Users/Marc/Desktop/Rutes/green_zones/pev_parcs_od_1.gpx"
    with open(path, 'r', encoding='utf-8') as  gpx_file:
        gpx = gpxpy.parse(gpx_file)

    for track in gpx.tracks:
        points = ''
        name = ''
        distance = 0
        waypoints = 0
        last_point = []
        first_point = []
        for extensions in track.extensions:
            if extensions.tag == '{http://osgeo.org/gdal}nom':
                name = extensions.text
        for segment in track.segments:
            for point in segment.points:
                waypoints += 1
                #Guardamos el punto inicial para cuando detectemos que llevamos 24 waypoints, ponerlo el ultimo para hacer que la ruta sea circular
                if not first_point:
                    first_point = point
                # Guardamos cada vez el punto anterior para poder hacer el calculo de la distancia
                if last_point and waypoints < 27:
                    distance += geopy.distance.geodesic(last_point , [point.longitude, point.latitude]).km 
                if waypoints < 25:
                    lat = round(point.latitude, 5)
                    lon = round(point.longitude, 5)
                    # points += '[' + str(point.longitude) + ',' + str(point.latitude) + '],' #Para mantener el formato con las rutas normales guardamos las coordenadas en fromato string
                    # last_point = [point.longitude, point.latitude]
                    points += f'[{lon}, {lat}],' #Para mantener el formato con las rutas normales guardamos las coordenadas en fromato string
                    last_point = [lon, lat]
                elif waypoints == 25:
                    lat = round(first_point.latitude, 5)
                    lon = round(first_point.longitude, 5)
                    # points += '[' + str(first_point.longitude) + ',' + str(first_point.latitude) + ']'  #Añadimos el primer punto al final y queda la ruta circular y terminamos
                    # last_point = [point.longitude, point.latitude]
                    points += f'[{lon}, {lat}]'
        #Acabamos de formatear las coordenadas
        coordinates = '[' + points + ']'
        coordinates = coordinates.replace(",]", "]")

        #Para no añadir demasidas rutas cortas, añadiremos solo las que tengan > 1.5km
        if (distance >= 1 and distance <= 1.5):
            new_route = RoutesModel(name, "FACIL", "PASEO", distance, "CIRCULAR", 
            coordinates, 0, "ZONES VERDES") 
            print(name)
            print(distance)
            with app.app_context():
                if not RoutesModel.find_by_name(new_route.name): #Para no añadir rutas repetidas
                    db.session.add(new_route)
                    db.session.commit()
                    db.session.close()

        if (distance > 1.5 and distance <= 2): #Para no añadir demasidas rutas cortas, añadiremos solo las que tengan > 1.5km
            new_route = RoutesModel(name, "MITJA", "PASEO", distance, "CIRCULAR", 
            coordinates, 0, "ZONES VERDES") 
            print(name)
            print(distance)
            with app.app_context():
                if not RoutesModel.find_by_name(new_route.name): #Para no añadir rutas repetidas
                    db.session.add(new_route)
                    db.session.commit()
                    db.session.close()

        if (distance > 2 ): #Para no añadir demasidas rutas cortas, añadiremos solo las que tengan > 1.5km
            new_route = RoutesModel(name, "DIFICIL", "PASEO", distance, "CIRCULAR", 
            coordinates, 0, "ZONES VERDES")
            print(name)
            print(distance)
            with app.app_context():
                if not RoutesModel.find_by_name(new_route.name): #Para no añadir rutas repetidas
                    db.session.add(new_route)
                    db.session.commit()
                    db.session.close()

    print("Guardando rutas ZONAS VERDES")
